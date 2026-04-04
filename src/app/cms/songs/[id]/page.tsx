import { connectDB } from '@/lib/mongodb'
import Song from '@/models/Song'
import Tag from '@/models/Tag'
import Album from '@/models/Album'
import SongForm from '@/components/cms/SongForm'
import CMSPageHeader from '@/components/cms/CMSPageHeader'
import { notFound } from 'next/navigation'
import mongoose from 'mongoose'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditSongPage({ params }: Props) {
  const { id } = await params;
  await connectDB();

  const [song, tags, albums] = await Promise.all([
    Song.findById(id).lean(),
    Tag.find().sort({ name: 1 }).lean(),
    Album.find().sort({ title: 1 }).lean(),
  ])

  if (!song) notFound()

  const serialisedSong = {
    _id:             song._id.toString(),
    title:           song.title,
    slug:            song.slug,
    albumId:         song.albumId?.toString() ?? '',
    trackNumber:     song.trackNumber     ?? '',
    description:     song.description     ?? '',
    lyrics:          song.lyrics          ?? '',
    storyBehindSong: song.storyBehindSong ?? '',
    audioUrl:        song.audioUrl        ?? '',
    videoUrl:        song.videoUrl        ?? '',
    coverImageUrl:   song.coverImageUrl   ?? '',
    tags:            song.tags.map((t: mongoose.Types.ObjectId) => t.toString()),
    isPublished:     song.isPublished,
  }

  const serialisedTags = tags.map(t => ({
    _id:  t._id.toString(),
    name: t.name,
    slug: t.slug,
  }))

  const serialisedAlbums = albums.map(a => ({
    _id:   a._id.toString(),
    title: a.title,
  }))

  return (
    <div>
      <CMSPageHeader
        title="Edit Song"
        createHref="/cms/songs/new"
        createLabel="New Song"
      />
      <div className="mt-6">
        <SongForm
          song={serialisedSong}
          tags={serialisedTags}
          albums={serialisedAlbums}
        />
      </div>
    </div>
  )
}