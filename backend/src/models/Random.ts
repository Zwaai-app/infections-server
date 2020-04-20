import { Schema, Document, model } from 'mongoose'

export type RandomDocument = Document & { value: string }

const schema = new Schema({ value: String })
export const Random = model<RandomDocument>('Random', schema)
