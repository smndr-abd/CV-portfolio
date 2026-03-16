// api/_lib/db.js
// Shared MongoDB connection — reused across serverless function invocations
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('MONGODB_URI environment variable is not set')

let client
let clientPromise

if (process.env.NODE_ENV === 'development') {
  // In development, reuse the client across hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export async function getDb() {
  const client = await clientPromise
  return client.db('portfolio')
}

export default clientPromise
