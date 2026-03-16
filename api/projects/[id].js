// api/projects/[id].js
// PUT /api/projects/:id — admin update
// DELETE /api/projects/:id — admin delete
import { getDb } from '../_lib/db.js'
import { cors, requireAuth } from '../_lib/auth.js'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  const user = requireAuth(req)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  const { id } = req.query
  if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID' })

  const db = await getDb()

  if (req.method === 'PUT') {
    const { title, category, description, imageUrl, liveUrl, githubUrl, tags, year, order } = req.body
    await db.collection('projects').updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, category, description, imageUrl, liveUrl, githubUrl, tags, year, order, updatedAt: new Date() } }
    )
    return res.status(200).json({ success: true })
  }

  if (req.method === 'DELETE') {
    await db.collection('projects').deleteOne({ _id: new ObjectId(id) })
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
