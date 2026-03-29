import mongoose, { Schema, Document } from 'mongoose';

export interface IAlbum extends Document {
  title: string;
  slug: string;
  releaseYear: number;
  coverImageUrl: string;
  description: string;
  tags: mongoose.Types.ObjectId[];
  seo: { metaTitle: string; metaDescription: string };
}

const AlbumSchema = new Schema<IAlbum>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    releaseYear: { type: Number, required: true },
    coverImageUrl: { type: String, required: true },
    description: { type: String },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    seo: {
      metaTitle: String,
      metaDescription: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Album ||
  mongoose.model<IAlbum>('Album', AlbumSchema);
