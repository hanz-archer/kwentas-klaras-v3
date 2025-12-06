import { connectToMongoDB } from '../../lib/mongodb'
import User from '../../models/User'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'User ID is required'
      })
    }

    await connectToMongoDB()

    const user = await User.findById(id).lean()

    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      })
    }

    return {
      success: true,
      user: {
        id: user._id.toString(),
        firebaseId: user.firebaseId,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        department: user.department,
        status: user.status,
        joined: user.joined ? new Date(user.joined).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : undefined,
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    if (error.name === 'CastError') {
      throw createError({
        statusCode: 400,
        message: 'Invalid user ID format'
      })
    }

    console.error('Error fetching user:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch user',
      data: error.message
    })
  }
})

