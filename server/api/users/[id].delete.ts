import { connectToMongoDB } from '../../lib/mongodb'
import { getFirebaseAuth } from '../../lib/firebase'
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

    const user = await User.findById(id)

    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      })
    }

    const firebaseId = user.firebaseId

    try {
      const firebaseAuth = getFirebaseAuth()
      await firebaseAuth.deleteUser(firebaseId)
    } catch (firebaseError: any) {
      if (firebaseError.code !== 'auth/user-not-found') {
        console.error('Error deleting user from Firebase:', firebaseError)
        throw createError({
          statusCode: 500,
          message: 'Failed to delete user from Firebase'
        })
      }
    }

    await User.findByIdAndDelete(id)

    return {
      success: true,
      message: 'User deleted successfully'
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

    console.error('Error deleting user:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to delete user',
      data: error.message
    })
  }
})

