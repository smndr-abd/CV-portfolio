// api/blog/[slug].js
import { getDb } from '../_lib/db.js'
import { cors, requireAuth } from '../_lib/auth.js'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  const { slug } = req.query
  const db = await getDb()

  if (req.method === 'GET') {
    const post = await db.collection('blog').findOne({ slug })
    if (!post) return res.status(404).json({ error: 'Post not found' })
    if (!post.published) {
      const user = requireAuth(req)
      if (!user) return res.status(404).json({ error: 'Post not found' })
    }
    // Increment view count
    db.collection('blog').updateOne({ slug }, { $inc: { views: 1 } })
    return res.status(200).json(post)
  }

  if (req.method === 'PUT') {
    const user = requireAuth(req)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })
    const { title, content, excerpt, tags, published } = req.body
    await db.collection('blog').updateOne(
      { slug },
      { $set: { title, content, excerpt, tags, published, updatedAt: new Date() } }
    )
    return res.status(200).json({ success: true })
  }

  if (req.method === 'DELETE') {
    const user = requireAuth(req)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })
    await db.collection('blog').deleteOne({ slug })
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
