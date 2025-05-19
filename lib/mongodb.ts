import { MongoClient } from 'mongodb'

// Use the connection string you provided
const uri = process.env.MONGODB_URI || "mongodb+srv://Dhruv:Dhruv592003@cluster0.3ynkqjc.mongodb.net/AI-HR"
const options = {}

let client
let clientPromise: Promise<MongoClient>

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options)
  global._mongoClientPromise = client.connect()
}
clientPromise = global._mongoClientPromise

export default clientPromise