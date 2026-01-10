import { swaggerSpec } from '../config/swagger'

export default defineEventHandler(async (event) => {
  if (process.env.NODE_ENV !== 'development') {
    throw createError({
      statusCode: 404,
      message: 'Not found'
    })
  }

  setHeader(event, 'Content-Type', 'application/json')
  return swaggerSpec
})
