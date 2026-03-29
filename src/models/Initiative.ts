import mongoose, { Schema, Document } from 'mongoose';

export interface IInitiative extends Document {
  title: string;
  slug: string;
  description: string;
  body: string;
  coverImageUrl: string;
  externalLink: string;
  tags: mongoose.Types.ObjectId[];
}

const InitiativeSchema = new Schema<IInitiative>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    body: { type: String },
    coverImageUrl: { type: String },
    externalLink: { type: String },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  },
  { timestamps: true }
);

export default mongoose.models.Initiative ||
  mongoose.model<IInitiative>('Initiative', InitiativeSchema);
