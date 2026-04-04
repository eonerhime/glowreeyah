import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Song from '@/models/Song'
import slugify from 'slugify'
import { SongSchema } from '@/lib/validators/songValidator'
import mongoose from 'mongoose'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB()
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid song ID format' }, { status: 400 })
  }

  const song = await Song.findById(id)
    .populate('albumId', 'title slug')
    .populate('tags', 'name slug')
    .lean()

  if (!song) {
    return NextResponse.json(
      { error: `Song with ID ${id} was not found` },
      { status: 404 }
    )
  }
  return NextResponse.json({ data: song })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id }  = await params;

  await connectDB()

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid song ID format' }, { status: 400 })
  }

  const body   = await req.json()
  const parsed = SongSchema.partial().safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    )
  }

  // Check for duplicate track number within same album (exclude current song)
  if (parsed.data.trackNumber && parsed.data.albumId) {
    const existing = await Song.findOne({
      albumId:     parsed.data.albumId,
      trackNumber: parsed.data.trackNumber,
      _id:         { $ne: id },
    })
    if (existing) {
      return NextResponse.json(
        { error: { trackNumber: [`Track ${parsed.data.trackNumber} is already used in this album. Please choose a different number.`] } },
        { status: 422 }
      )
    }
  }

  const update = parsed.data.title
    ? { ...parsed.data, slug: slugify(parsed.data.title, { lower: true, strict: true }) }
    : parsed.data

  const song = await Song.findByIdAndUpdate(id, update, { new: true })

  if (!song) {
    return NextResponse.json(
      { error: `Song with ID ${id} could not be updated. It may have been deleted.` },
      { status: 404 }
    )
  }

  return NextResponse.json({ data: song })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await connectDB()

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid song ID format' }, { status: 400 })
  }

  const song = await Song.findByIdAndDelete(id)

  if (!song) {
    return NextResponse.json(
      { error: `Song with ID ${id} was not found or already deleted` },
      { status: 404 }
    )
  }

  return NextResponse.json({ ok: true })
}