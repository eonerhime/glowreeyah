import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteSettings extends Document {
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  heroLogoUrl: string;
  homeIntro: string;
  musicPageHeading: string;
  blogPageHeading: string;
  mediaPageHeading: string;
  speakingPageHeading: string;
  impactPageHeading: string;
  bookingPageHeading: string;
  bookingPageSubtext: string;
  footerTagline: string;
  footerLogoUrl: string;
  navLogoUrl: string;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    heroTitle: { type: String, default: 'Glowreeyah' },
    heroSubtitle: { type: String, default: 'Music. Ministry. Movement.' },
    heroImageUrl: { type: String },
    heroLogoUrl: { type: String },
    homeIntro: { type: String },
    musicPageHeading: { type: String, default: 'Music' },
    blogPageHeading: { type: String, default: 'Blog' },
    mediaPageHeading: { type: String, default: 'Media & Press' },
    speakingPageHeading: { type: String, default: 'Speaking & Events' },
    impactPageHeading: { type: String, default: 'Impact & Initiatives' },
    bookingPageHeading: { type: String, default: 'Book Glowreeyah' },
    bookingPageSubtext: {
      type: String,
      default: 'Fill in the form below and we will be in touch shortly.',
    },
    footerTagline: { type: String, default: 'Music. Ministry. Movement.' },
    footerLogoUrl: { type: String },
    navLogoUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
