import Image from 'next/image';

export interface MediaAssetType {
  _id: string;
  url: string;
  altText: string;
  type: 'image' | 'video' | 'audio';
  linkedContentType?: string;
}

interface Props {
  asset: MediaAssetType;
}

export default function MediaCard({ asset }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {asset.type === 'image' && (
        <Image
          src={asset.url}
          alt={asset.altText}
          width={600}
          height={192}
          quality={75}
          className="w-full h-48 object-cover"
        />
      )}
      {asset.type === 'video' && (
        <div className="aspect-video bg-brand-deep flex items-center justify-center">
          <span className="text-white/40 text-sm">Video</span>
        </div>
      )}
      {asset.type === 'audio' && (
        <div className="h-48 bg-brand-deep flex items-center justify-center px-4">
          <audio controls src={asset.url} className="w-full" />
        </div>
      )}
      <div className="p-4">
        <p className="text-xs text-gray-400 uppercase tracking-widest ">
          {asset.type}
        </p>
        <p className="text-sm text-gray-700 mt-1 line-clamp-2">
          {asset.altText}
        </p>
      </div>
    </div>
  );
}
