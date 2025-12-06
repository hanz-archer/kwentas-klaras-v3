import mongoose, { Schema, Document, Model } from 'mongoose'
import { UserDepartment, USER_DEPARTMENTS } from '../../app/types/userDepartment'
import { UserService, USER_SERVICES } from '../../app/types/userServices'

export interface IProject extends Document {
  name: string
  implementingUnit: UserDepartment
  appropriation: number
  startDate: Date
  endDate: Date
  year: number
  services: UserService
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema: Schema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    implementingUnit: {
      type: String,
      required: true,
      enum: USER_DEPARTMENTS,
    },
    appropriation: {
      type: Number,
      required: true,
      min: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (this: IProject, value: Date) {
          return value >= this.startDate
        },
        message: 'End date must be after or equal to start date',
      },
    },
    year: {
      type: Number,
      required: true,
      min: 2000,
      max: 2100,
    },
    services: {
      type: String,
      required: true,
      enum: USER_SERVICES,
    },
  },
  {
    timestamps: true,
  }
)

ProjectSchema.index({ name: 1 })
ProjectSchema.index({ implementingUnit: 1 })
ProjectSchema.index({ year: 1 })
ProjectSchema.index({ startDate: 1 })
ProjectSchema.index({ endDate: 1 })

const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema)

export default Project

