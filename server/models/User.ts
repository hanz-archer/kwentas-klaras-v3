import mongoose, { Schema, Document, Model } from 'mongoose'
import { UserDepartment, USER_DEPARTMENTS } from '../../app/types/userDepartment'

export interface IUser extends Document {
  firebaseId: string
  firstName: string
  lastName: string
  username: string
  email: string
  department: UserDepartment
  status: 'Active' | 'Inactive'
  joined: Date
  createdAt: Date
  updatedAt: Date
}

const UserSchema: Schema = new Schema<IUser>(
  {
    firebaseId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    department: {
      type: String,
      required: true,
      enum: USER_DEPARTMENTS,
    },
    status: {
      type: String,
      required: true,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    joined: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

UserSchema.index({ firebaseId: 1 })
UserSchema.index({ email: 1 })
UserSchema.index({ username: 1 })

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default User

