import Link from 'next/link';
import Image from 'next/image';

export interface AlbumType {
  _id: string;
  title: string;
  slug: string;
  releaseYear: number;
  coverImageUrl: string;
  description?: string;
}

interface Props {
  album: AlbumType;
}

export default function AlbumCard({ album }: Props) {
  return (
    <Link href={`/music/${album.slug}`}>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:border-brand-teal transition-colors overflow-hidden">
        {album.coverImageUrl && (
          <Image
            src={album.coverImageUrl}
            alt={album.title}
            width={600}
            height={192}
            quality={75}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-5">
          <h2 className="font-serif text-lg text-brand-deep font-semibold mb-1 line-clamp-2">
            {album.title}
          </h2>
          <p className="text-sm text-brand-teal">{album.releaseYear}</p>
          {album.description && (
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
              {album.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
