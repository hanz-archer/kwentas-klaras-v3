import { connectToMongoDB } from '../../lib/mongodb'
import User from '../../models/User'

export default defineEventHandler(async (event) => {
  try {
    await connectToMongoDB()

    const users = await User.find({})
      .sort({ createdAt: -1 })
      .lean()

    const formattedUsers = users.map((user: any) => ({
      id: user._id.toString(),
      firebaseId: user.firebaseId,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      department: user.department,
      status: user.status,
      joined: user.joined ? new Date(user.joined).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : undefined,
    }))

    return {
      success: true,
      users: formattedUsers,
    }
  } catch (error: any) {
    console.error('Error fetching users:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch users',
      data: error.message
    })
  }
})

