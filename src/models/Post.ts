import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  slug: string;
  category: 'blog' | 'devotional' | 'story';
  body: string;
  excerpt: string;
  coverImageUrl: string;
  tags: mongoose.Types.ObjectId[];
  isPublished: boolean;
  publishedAt: Date;
  seo: { metaTitle: string; metaDescription: string };
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ['blog', 'devotional', 'story'],
      default: 'blog',
    },
    body: { type: String, required: true },
    excerpt: { type: String, maxlength: 300 },
    coverImageUrl: { type: String },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
    seo: {
      metaTitle: String,
      metaDescription: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Post ||
  mongoose.model<IPost>('Post', PostSchema);
