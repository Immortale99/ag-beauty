// components/Gallery.js
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Loader } from 'lucide-react';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Tout');
  const [loading, setLoading] = useState(true);
  const categories = ['Tout', 'Nail Art', 'French', 'Gel', 'Déco'];

  // Charger les images depuis l'API
  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const res = await fetch('/api/gallery/images');
      if (res.ok) {
        const data = await res.json();
        setImages(data.images);
      }
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les images par catégorie
  const filteredImages = selectedCategory === 'Tout'
    ? images
    : images.filter(img => img.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Nos Réalisations</h2>
      
      {/* Filtres par catégorie */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 snap-x">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap snap-start ${
              selectedCategory === category
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grille d'images */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filteredImages.map((image) => (
          <div 
            key={image.id} 
            className="relative group aspect-square"
          >
            <Image
              src={image.url}
              alt={image.description || 'Réalisation'}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 50vw, 33vw"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 rounded-lg">
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <p className="font-bold">{image.category}</p>
                <p className="text-lg">{image.price}€</p>
                {image.description && (
                  <p className="text-sm opacity-90 mt-1">{image.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message si aucune image */}
      {filteredImages.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Aucune réalisation dans cette catégorie pour le moment
        </div>
      )}
    </div>
  );
}