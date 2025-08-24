export const generateTrackingNumber = (): string => {
  const prefix = "CS" // Courier Service
  const timestamp = Date.now().toString().slice(-8)
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}${timestamp}${random}`
}
