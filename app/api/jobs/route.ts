import { NextResponse } from 'next/server'
import Job from '@/models/Job'
import connectDB from '@/lib/mongodb'

export async function GET() {
  try {
    await connectDB()
    const jobs = await Job.find({}).sort({ postedDate: -1 })
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
    await connectDB()
    const data = await request.json()
    
    const job = new Job({
      ...data,
      postedDate: new Date()
    })

    const result = await job.save()
    return NextResponse.json(result, { status: 201 })
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
    await connectDB()
    const { id, ...update } = await request.json()
    
    const result = await Job.findByIdAndUpdate(
      id,
      { 
        ...update,
        updatedAt: new Date()
      },
      { new: true }
    )

    if (!result) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result)
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
    await connectDB()
    const { id } = await request.json()
    
    const result = await Job.findByIdAndDelete(id)
    
    if (!result) {
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
