// api/admin/messages.js
// GET /api/admin/messages — list all contact messages
// PUT /api/admin/messages?id=xxx — mark as read
// DELETE /api/admin/messages?id=xxx — delete message
import { getDb } from '../_lib/db.js'
import { cors, requireAuth } from '../_lib/auth.js'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  const user = requireAuth(req)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  const db = await getDb()

  if (req.method === 'GET') {
    const messages = await db.collection('messages')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()
    return res.status(200).json(messages)
  }

  const { id } = req.query
  if (!id || !ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID' })

  if (req.method === 'PUT') {
    await db.collection('messages').updateOne(
      { _id: new ObjectId(id) },
      { $set: { read: true } }
    )
    return res.status(200).json({ success: true })
  }

  if (req.method === 'DELETE') {
    await db.collection('messages').deleteOne({ _id: new ObjectId(id) })
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
