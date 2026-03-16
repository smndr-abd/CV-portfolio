// api/projects/index.js
// GET /api/projects — public list
// POST /api/projects — admin create
import { getDb } from '../_lib/db.js'
import { cors, requireAuth } from '../_lib/auth.js'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  const db = await getDb()

  // GET — public
  if (req.method === 'GET') {
    const projects = await db.collection('projects')
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray()
    return res.status(200).json(projects)
  }

  // POST — admin only
  if (req.method === 'POST') {
    const user = requireAuth(req)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    const { title, category, description, imageUrl, liveUrl, githubUrl, tags, year } = req.body
    if (!title || !category) return res.status(400).json({ error: 'Title and category are required' })

    const result = await db.collection('projects').insertOne({
      title,
      category,
      description: description || '',
      imageUrl: imageUrl || '',
      liveUrl: liveUrl || '',
      githubUrl: githubUrl || '',
      tags: tags || [],
      year: year || new Date().getFullYear().toString(),
      order: 0,
      createdAt: new Date(),
    })

    return res.status(201).json({ success: true, id: result.insertedId })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
