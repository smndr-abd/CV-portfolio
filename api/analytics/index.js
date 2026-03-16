// api/analytics/index.js
// POST /api/analytics — track an event (pageview or section_view)
// GET  /api/analytics — admin: get aggregated stats
import { getDb } from '../_lib/db.js'
import { cors, requireAuth } from '../_lib/auth.js'

export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  const db = await getDb()

  // Track event — public (no auth needed)
  if (req.method === 'POST') {
    const { type, page, section, referrer } = req.body
    if (!type) return res.status(400).json({ error: 'type is required' })

    // Basic bot filtering
    const ua = req.headers['user-agent'] || ''
    if (/bot|crawl|spider|slurp|bingpreview/i.test(ua)) {
      return res.status(200).json({ ok: true })
    }

    await db.collection('analytics').insertOne({
      type,           // 'pageview' | 'section_view' | 'click'
      page: page || '/',
      section: section || null,
      referrer: referrer || req.headers['referer'] || null,
      ua: ua.slice(0, 120),
      ip: (req.headers['x-forwarded-for'] || '').split(',')[0].trim(),
      ts: new Date(),
    })

    return res.status(201).json({ ok: true })
  }

  // Get stats — admin only
  if (req.method === 'GET') {
    const user = requireAuth(req)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    const now = new Date()
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000)

    const [
      totalViews,
      last30Days,
      bySection,
      byDay,
      topReferrers,
    ] = await Promise.all([
      db.collection('analytics').countDocuments({ type: 'pageview' }),
      db.collection('analytics').countDocuments({ type: 'pageview', ts: { $gte: thirtyDaysAgo } }),
      db.collection('analytics').aggregate([
        { $match: { type: 'section_view', section: { $ne: null } } },
        { $group: { _id: '$section', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]).toArray(),
      db.collection('analytics').aggregate([
        { $match: { type: 'pageview', ts: { $gte: thirtyDaysAgo } } },
        { $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$ts' } },
          count: { $sum: 1 },
        }},
        { $sort: { _id: 1 } },
      ]).toArray(),
      db.collection('analytics').aggregate([
        { $match: { referrer: { $ne: null }, type: 'pageview' } },
        { $group: { _id: '$referrer', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]).toArray(),
    ])

    return res.status(200).json({ totalViews, last30Days, bySection, byDay, topReferrers })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
