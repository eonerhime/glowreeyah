import mongoose, { Schema, Document } from 'mongoose';

export interface ISong extends Document {
  title: string;
  slug: string;
  albumId: mongoose.Types.ObjectId;
  trackNumber: number;
  description: string;
  lyrics: string;
  storyBehindSong: string;
  audioUrl: string;
  videoUrl: string;
  coverImageUrl: string;
  tags: mongoose.Types.ObjectId[];
  isPublished: boolean;
  seo: { metaTitle: string; metaDescription: string };
}

const SongSchema = new Schema<ISong>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    albumId: { type: Schema.Types.ObjectId, ref: 'Album', required: true },
    trackNumber: { type: Number },
    description: { type: String },
    lyrics: { type: String },
    storyBehindSong: { type: String },
    audioUrl: { type: String },
    videoUrl: { type: String },
    coverImageUrl: { type: String },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    isPublished: { type: Boolean, default: true },
    seo: {
      metaTitle: String,
      metaDescription: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Song ||
  mongoose.model<ISong>('Song', SongSchema);
