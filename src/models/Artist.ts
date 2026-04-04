import mongoose, { Schema, Document } from 'mongoose';

export interface IArtist extends Document {
  name: string;
  slugName: string;
  biographyShort: string;
  biographyMedium: string;
  biographyLong: string;
  achievements: string[];
  speakingProfile: string;
  profileImageUrl: string;
  socialLinks: {
    instagram?: string;
    youtube?: string;
    spotify?: string;
    twitter?: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
  updatedAt: Date;
}

const ArtistSchema = new Schema<IArtist>(
  {
    name: { type: String, required: true },
    slugName: { type: String, unique: true },
    biographyShort: { type: String, maxlength: 160 },
    biographyMedium: { type: String, maxlength: 500 },
    biographyLong: { type: String, required: true },
    achievements: [{ type: String }],
    speakingProfile: { type: String },
    profileImageUrl: { type: String, required: true },
    socialLinks: {
      instagram: String,
      youtube: String,
      spotify: String,
      twitter: String,
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
    },
  },
  { timestamps: true }
);

// Delete cached model before recompiling
delete (mongoose.models as Record<string, unknown>).Artist;
export default mongoose.model<IArtist>('Artist', ArtistSchema);

// export default mongoose.models.Artist ||  mongoose.model<IArtist>('Artist', ArtistSchema);
