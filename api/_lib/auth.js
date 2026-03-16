// api/_lib/auth.js
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET
if (!SECRET) throw new Error('JWT_SECRET environment variable is not set')

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET)
  } catch {
    return null
  }
}

export function requireAuth(req) {
  const auth = req.headers['authorization']
  if (!auth || !auth.startsWith('Bearer ')) return null
  return verifyToken(auth.slice(7))
}

export function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}
