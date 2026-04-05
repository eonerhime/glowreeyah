import mongoose, { Schema, Document } from 'mongoose';

export interface IGalleryPhoto extends Document {
  url: string;
  caption: string;
  linkedType: 'event' | 'initiative';
  linkedId: mongoose.Types.ObjectId;
  order: number;
  createdAt: Date;
}

const GalleryPhotoSchema = new Schema<IGalleryPhoto>(
  {
    url: { type: String, required: true },
    caption: { type: String, default: '' },
    linkedType: { type: String, enum: ['event', 'initiative'], required: true },
    linkedId: { type: Schema.Types.ObjectId, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.GalleryPhoto ||
  mongoose.model<IGalleryPhoto>('GalleryPhoto', GalleryPhotoSchema);
