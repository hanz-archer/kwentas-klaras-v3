import mongoose from 'mongoose'

let isConnected = false

export async function connectToMongoDB(): Promise<void> {
  if (isConnected) {
    return
  }

  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set')
  }

  try {
    await mongoose.connect(uri)
    isConnected = true
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}

export async function getMongoDB(): Promise<typeof mongoose> {
  if (!isConnected) {
    await connectToMongoDB()
  }
  return mongoose
}

export async function closeMongoDB(): Promise<void> {
  if (isConnected) {
    await mongoose.connection.close()
    isConnected = false
    console.log('MongoDB connection closed')
  }
}
