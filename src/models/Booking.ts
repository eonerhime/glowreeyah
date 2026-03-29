import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  name: string;
  email: string;
  organisation: string;
  eventType: string;
  eventDate: string;
  message: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'declined';
}

const BookingSchema = new Schema<IBooking>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    organisation: { type: String },
    eventType: { type: String },
    eventDate: { type: String },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'accepted', 'declined'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Booking ||
  mongoose.model<IBooking>('Booking', BookingSchema);
