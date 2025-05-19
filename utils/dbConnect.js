import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://Dhruv:Dhruv592003@cluster0.3ynkqjc.mongodb.net/AI-HR";
const options = {};

let client;
let clientPromise;

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
