import { X, Edit2, Trash } from 'lucide-react';
import Image from 'next/image';

export default function ImagePreview({ 
  image, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete 
}) {
  if (!isOpen || !image) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      {/* Container */}
      <div className="relative w-full max-w-4xl">
        {/* Bouton fermer */}
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300"
        >
          <X size={24} />
        </button>

        {/* Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden bg-black">
          <Image
            src={image.url}
            alt={image.description || 'Image preview'}
            fill
            className="object-contain"
          />
        </div>

        {/* Informations et actions */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-lg">{image.category}</p>
              <p className="text-xl">{image.price}€</p>
              {image.description && (
                <p className="text-sm opacity-90 mt-1">{image.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => onEdit(image)}
                className="p-2 bg-white/20 rounded-full hover:bg-white/30"
              >
                <Edit2 size={20} />
              </button>
              <button 
                onClick={() => onDelete(image)}
                className="p-2 bg-red-500/50 rounded-full hover:bg-red-500/70"
              >
                <Trash size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}