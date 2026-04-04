import mongoose, { Schema, Document } from 'mongoose';

export interface IContactMessage extends Document {
  name: string;
  email: string;
  phone: string;
  socialHandle: string;
  subject: string;
  message: string;
  createdAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    socialHandle: { type: String },
    subject: { type: String },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.ContactMessage ||
  mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema);
