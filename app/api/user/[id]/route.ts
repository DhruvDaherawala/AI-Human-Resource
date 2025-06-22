import { NextRequest, NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongodb'
import User from '@/models/User'
import { IUser } from '@/models/User'

// GET user by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDB()
    const user = await User.findById(params.id).select('-password')
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }
    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

// PATCH update user profile
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDB()
    const body = await req.json()
    const { firstName, lastName, companyName, phoneNumber } = body

    const updatedUser = await User.findByIdAndUpdate(
      params.id,
      {
        $set: {
          firstName,
          lastName,
          companyName,
          phoneNumber,
        },
      },
      { new: true, runValidators: true }
    ).select('-password')

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(updatedUser, { status: 200 })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
} 