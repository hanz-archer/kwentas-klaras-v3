export function clearAllStorage(): void {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('Failed to clear localStorage:', error)
  }

  try {
    sessionStorage.clear()
  } catch (error) {
    console.error('Failed to clear sessionStorage:', error)
  }
}
