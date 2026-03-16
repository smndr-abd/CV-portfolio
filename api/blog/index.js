// api/blog/index.js
// GET /api/blog — list published posts
// POST /api/blog — admin create post
import { getDb } from '../_lib/db.js'
import { cors, requireAuth } from '../_lib/auth.js'

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  const db = await getDb()

  if (req.method === 'GET') {
    const { draft } = req.query
    const user = draft ? requireAuth(req) : null
    const filter = (draft && user) ? {} : { published: true }
    const posts = await db.collection('blog')
      .find(filter, { projection: { content: 0 } }) // exclude full content from list
      .sort({ createdAt: -1 })
      .toArray()
    return res.status(200).json(posts)
  }

  if (req.method === 'POST') {
    const user = requireAuth(req)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    const { title, content, excerpt, tags, published } = req.body
    if (!title || !content) return res.status(400).json({ error: 'Title and content are required' })

    const slug = slugify(title)
    // Ensure unique slug
    const existing = await db.collection('blog').findOne({ slug })
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug

    const result = await db.collection('blog').insertOne({
      title,
      slug: finalSlug,
      content,
      excerpt: excerpt || content.slice(0, 160) + '...',
      tags: tags || [],
      published: published ?? false,
      readTime: Math.ceil(content.split(' ').length / 200) + ' min read',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return res.status(201).json({ success: true, id: result.insertedId, slug: finalSlug })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
