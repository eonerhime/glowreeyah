import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { Resend } from 'resend';

const VALID_STATUSES = ['pending', 'reviewed', 'accepted', 'declined'] as const;
const resend = new Resend(process.env.RESEND_API_KEY);

const statusMessages: Record<string, { subject: string; html: string }> = {
  accepted: {
    subject: 'Your booking request has been accepted — Glowreeyah',
    html: `
      <h2>Great news!</h2>
      <p>Your booking request has been <strong>accepted</strong>.</p>
      <p>Our team will be in touch shortly with next steps and details.</p>
      <p>Thank you for reaching out to Glowreeyah.</p>
    `,
  },
  declined: {
    subject: 'Update on your booking request — Glowreeyah',
    html: `
      <h2>Thank you for your interest</h2>
      <p>Unfortunately, we are unable to accommodate your booking request at this time.</p>
      <p>We appreciate you reaching out and hope to connect in the future.</p>
    `,
  },
  reviewed: {
    subject: 'Your booking request is being reviewed — Glowreeyah',
    html: `
      <h2>We've received your request</h2>
      <p>Your booking request is currently <strong>under review</strong>.</p>
      <p>We'll get back to you soon with a decision.</p>
    `,
  },
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();

  const { status } = await req.json();
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: { status: ['Invalid status value'] } },
      { status: 422 }
    );
  }

  const booking = await Booking.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
  if (!booking)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Send email notification for actionable statuses
  const emailTemplate = statusMessages[status];
  if (emailTemplate && booking.email) {
    try {
      const result = await resend.emails.send({
        from: 'Glowreeyah <onboarding@resend.dev>',
        to: booking.email,
        subject: emailTemplate.subject,
        html: `
        ${emailTemplate.html}
        <hr />
        <p style="color:#888;font-size:12px;">
          This message is regarding your booking request submitted as ${booking.name}.
        </p>
      `,
      });
      console.log('Email sent:', result);
    } catch (emailError) {
      console.error('Email send failed:', emailError);
    }
  }

  return NextResponse.json({ data: booking });
}
