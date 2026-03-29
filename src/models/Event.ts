import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  slug: string;
  date: Date;
  location: string;
  description: string;
  externalLink: string;
  isUpcoming: boolean;
  coverImageUrl: string;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    description: { type: String },
    externalLink: { type: String },
    isUpcoming: { type: Boolean, default: true },
    coverImageUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Event ||
  mongoose.model<IEvent>('Event', EventSchema);
