import { NextRequest, NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDB()
    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    const user = await User.findById(params.id)

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid current password' }, { status: 401 })
    }

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)
    
    await user.save()

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error updating password:', error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
} 