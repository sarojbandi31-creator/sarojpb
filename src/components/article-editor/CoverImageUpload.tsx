import { useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CoverImageUploadProps {
  coverImage: string | null;
  onUpload: (file: File) => Promise<string | null>;
  onRemove: () => void;
}

export function CoverImageUpload({ coverImage, onUpload, onRemove }: CoverImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      await onUpload(file);
      setIsUploading(false);
    }
  };

  if (coverImage) {
    return (
      <div className="relative aspect-[21/9] rounded-lg overflow-hidden group">
        <img
          src={coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            variant="destructive"
            size="sm"
            onClick={onRemove}
            className="gap-2"
          >
            <X size={16} />
            Remove Cover
          </Button>
        </div>
      </div>
    );
  }

  return (
    <label className="block">
      <div className="border-2 border-dashed border-border rounded-lg aspect-[21/9] flex flex-col items-center justify-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-colors">
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <span className="text-muted-foreground text-sm">Uploading...</span>
          </div>
        ) : (
          <>
            <ImagePlus size={48} className="text-muted-foreground mb-3" />
            <span className="text-muted-foreground text-sm font-medium">
              Click to add a cover image
            </span>
            <span className="text-muted-foreground/70 text-xs mt-1">
              Recommended: 1200 x 630 pixels
            </span>
          </>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
        disabled={isUploading}
      />
    </label>
  );
}
