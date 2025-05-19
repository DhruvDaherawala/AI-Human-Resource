import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import Job from '@/models/Job'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('AI-HR')
    const jobs = await db.collection('jobs').find({}).sort({ postedDate: -1 }).toArray()
    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db('AI-HR')
    const data = await request.json()
    
    const result = await db.collection('jobs').insertOne({
      ...data,
      postedDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const newJob = await db.collection('jobs').findOne({ _id: result.insertedId })
    return NextResponse.json(newJob, { status: 201 })
  } catch (error) {
    console.error('Error creating job:', error)
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db('AI-HR')
    const { id, ...update } = await request.json()
    
    const result = await db.collection('jobs').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          ...update,
          updatedAt: new Date()
        } 
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    const updatedJob = await db.collection('jobs').findOne({ _id: new ObjectId(id) })
    return NextResponse.json(updatedJob)
  } catch (error) {
    console.error('Error updating job:', error)
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db('AI-HR')
    const { id } = await request.json()
    
    const result = await db.collection('jobs').deleteOne({ _id: new ObjectId(id) })
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Job deleted successfully' })
  } catch (error) {
    console.error('Error deleting job:', error)
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    )
  }
}
