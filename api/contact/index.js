// api/contact/index.js
// POST /api/contact — save message to DB and send email notification
import { getDb } from '../_lib/db.js'
import { cors } from '../_lib/auth.js'
import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { name, email, message } = req.body

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  try {
    // 1. Save to MongoDB
    const db = await getDb()
    const result = await db.collection('messages').insertOne({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      read: false,
      createdAt: new Date(),
    })

    // 2. Send email notification (optional — won't fail submission if email fails)
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password (not your real password)
        },
      })

      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
        to: process.env.NOTIFY_EMAIL || process.env.GMAIL_USER,
        replyTo: email,
        subject: `New message from ${name}`,
        html: `
          <div style="font-family:monospace;max-width:600px;margin:0 auto;padding:32px;background:#0a0a0a;color:#f0ede6;border-radius:8px;">
            <h2 style="color:#e8ff47;margin-bottom:24px;font-size:20px;">New portfolio message</h2>
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}" style="color:#e8ff47;">${email}</a></p>
            <hr style="border-color:#2a2a2a;margin:20px 0;" />
            <p style="white-space:pre-wrap;color:#ccc;">${message}</p>
            <hr style="border-color:#2a2a2a;margin:20px 0;" />
            <p style="color:#888;font-size:12px;">Received at ${new Date().toUTCString()}</p>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error('Email send failed (message still saved):', emailErr.message)
    }

    return res.status(201).json({ success: true, id: result.insertedId })
  } catch (err) {
    console.error('Contact error:', err)
    return res.status(500).json({ error: 'Failed to send message. Please try again.' })
  }
}
