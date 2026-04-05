import mongoose, { Schema, Document } from 'mongoose';

export interface IGalleryVideo extends Document {
  videoUrl: string;
  platform: 'youtube' | 'vimeo';
  thumbnailUrl: string;
  caption: string;
  linkedType: 'event' | 'initiative';
  linkedId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const GalleryVideoSchema = new Schema<IGalleryVideo>(
  {
    videoUrl: { type: String, required: true },
    platform: { type: String, enum: ['youtube', 'vimeo'], required: true },
    thumbnailUrl: { type: String, default: '' },
    caption: { type: String, default: '' },
    linkedType: { type: String, enum: ['event', 'initiative'], required: true },
    linkedId: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.GalleryVideo ||
  mongoose.model<IGalleryVideo>('GalleryVideo', GalleryVideoSchema);
