// api/admin/login.js
// POST /api/admin/login — returns JWT on valid credentials
import { cors, signToken } from '../_lib/auth.js'

export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { password } = req.body
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

  if (!ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'Admin password not configured' })
  }

  if (!password || password !== ADMIN_PASSWORD) {
    // Slight delay to prevent brute force
    await new Promise(r => setTimeout(r, 800))
    return res.status(401).json({ error: 'Invalid password' })
  }

  const token = signToken({ role: 'admin' })
  return res.status(200).json({ token })
}
