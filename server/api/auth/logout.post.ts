export default defineEventHandler(async (event) => {
  deleteCookie(event, 'session_token', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
  })

  return {
    success: true,
    message: 'Logged out successfully',
  }
})
