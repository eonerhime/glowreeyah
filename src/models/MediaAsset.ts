import mongoose, { Schema, Document } from 'mongoose';

export interface IMediaAsset extends Document {
  url: string;
  publicId: string; // Cloudinary public_id for deletion/transforms
  altText: string;
  type: 'image' | 'video' | 'audio';
  linkedContentId: mongoose.Types.ObjectId;
  linkedContentType: string; // 'Song' | 'Post' | 'Album' etc.
  tags: mongoose.Types.ObjectId[];
}

const MediaAssetSchema = new Schema<IMediaAsset>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    altText: { type: String, required: true },
    type: { type: String, enum: ['image', 'video', 'audio'], required: true },
    linkedContentId: { type: Schema.Types.ObjectId },
    linkedContentType: { type: String },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  },
  { timestamps: true }
);

export default mongoose.models.MediaAsset ||
  mongoose.model<IMediaAsset>('MediaAsset', MediaAssetSchema);
