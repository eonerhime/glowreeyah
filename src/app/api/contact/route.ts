import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import ContactMessage from '@/models/ContactMessage';
import { z } from 'zod';
import { Resend } from 'resend';

const ContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional().or(z.literal('')),
  socialHandle: z.string().optional().or(z.literal('')),
  subject: z.string().optional().or(z.literal('')),
  message: z.string().min(1, 'Message is required'),
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = ContactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { name, email, phone, socialHandle, subject, message } = parsed.data;

  await connectDB();
  await ContactMessage.create({
    name,
    email,
    phone,
    socialHandle,
    subject,
    message,
  });

  await resend.emails.send({
    from: 'Glowreeyah Website <noreply@glowreeyah.com>',
    to: process.env.CONTACT_EMAIL!,
    subject: `New message: ${subject || 'No subject'} — from ${name}`,
    html: `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || '—'}</p>
      <p><strong>Social:</strong> ${socialHandle || '—'}</p>
      <p><strong>Subject:</strong> ${subject || '—'}</p>
      <hr />
      <p>${message.replace(/\n/g, '<br />')}</p>
    `,
  });

  return NextResponse.json({ ok: true });
}
