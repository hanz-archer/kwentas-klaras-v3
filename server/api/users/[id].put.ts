import { connectToMongoDB } from '../../lib/mongodb'
import User from '../../models/User'
import { UserDepartment } from '../../../app/types/userDepartment'

interface UpdateUserRequest {
  firstName?: string
  lastName?: string
  username?: string
  email?: string
  department?: UserDepartment
  status?: 'Active' | 'Inactive'
}

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'User ID is required'
      })
    }

    const body = await readBody<UpdateUserRequest>(event)

    await connectToMongoDB()

    const user = await User.findById(id)

    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      })
    }

    if (body.firstName !== undefined) {
      user.firstName = body.firstName.trim()
    }

    if (body.lastName !== undefined) {
      user.lastName = body.lastName.trim()
    }

    if (body.username !== undefined) {
      const username = body.username.startsWith('@') ? body.username : `@${body.username}`
      user.username = username.trim()
    }

    if (body.email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(body.email)) {
        throw createError({
          statusCode: 400,
          message: 'Invalid email format'
        })
      }
      user.email = body.email.toLowerCase().trim()
    }

    if (body.department !== undefined) {
      user.department = body.department
    }

    if (body.status !== undefined) {
      user.status = body.status
    }

    await user.save()

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

    if (error.code === 11000) {
      throw createError({
        statusCode: 409,
        message: 'User with this email or username already exists'
      })
    }

    console.error('Error updating user:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update user',
      data: error.message
    })
  }
})

