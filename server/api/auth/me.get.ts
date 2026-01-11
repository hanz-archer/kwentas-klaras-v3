import { getFirebaseAuth } from '../../lib/firebase'
import { withErrorHandler } from '../../utils/errorHandler'
import { UserRepository } from '../../repositories/user/UserRepository'
import { UserSerializer } from '../../serializers/UserSerializer'

export default defineEventHandler(async (event) => {
  const sessionToken = getCookie(event, 'session_token')

  if (!sessionToken) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated'
    })
  }

  return await withErrorHandler(async () => {
    const authHeader = getHeader(event, 'authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        message: 'Authorization token required'
      })
    }

    const idToken = authHeader.replace('Bearer ', '')
    const firebaseAuth = getFirebaseAuth()
    const decodedToken = await firebaseAuth.verifyIdToken(idToken)

    const userRepository = new UserRepository()
    const dbUser = await userRepository.findByFirebaseId(decodedToken.uid)

    if (!dbUser || dbUser.status !== 'Active') {
      throw createError({
        statusCode: 404,
        message: 'User not found or inactive'
      })
    }

    return {
      success: true,
      user: UserSerializer.formatUser(dbUser)
    }
  }, {
    defaultStatusCode: 401,
    defaultMessage: 'Invalid token'
  })
})
