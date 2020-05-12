import mongoose from 'mongoose'
import { UserDocument } from './User'

export type SpaceDocument = mongoose.Document & {
  user: UserDocument
  name: string
  description: string | null
  autoCheckout: number // disabled is represented as -1
}

const spaceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: String,
    autoCheckout: Number
  },
  {
    timestamps: true
  }
)

export const Space = mongoose.model<SpaceDocument>('Space', spaceSchema)
