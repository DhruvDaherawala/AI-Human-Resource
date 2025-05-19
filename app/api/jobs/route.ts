import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET() {
  const client = await clientPromise
  const db = client.db('AI-HR')
  const jobs = await db.collection('jobs').find({}).toArray()
  return NextResponse.json(jobs)
}

export async function POST(request: Request) {
  const body = await request.json()
  const client = await clientPromise
  const db = client.db('AI-HR')
  const result = await db.collection('jobs').insertOne({
    ...body,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return NextResponse.json({ success: true, jobId: result.insertedId })
}

export async function PUT(request: Request) {
  const body = await request.json()
  const { id, ...update } = body
  const client = await clientPromise
  const db = client.db('AI-HR')
  await db.collection('jobs').updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...update, updatedAt: new Date() } }
  )
  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  const client = await clientPromise
  const db = client.db('AI-HR')
  await db.collection('jobs').deleteOne({ _id: new ObjectId(id) })
  return NextResponse.json({ success: true })
}
