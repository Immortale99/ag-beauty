import { useState, useEffect } from 'react';
import GalleryFilters from './GalleryFilters';
import ImageCard from './ImageCard';
import ImagePreview from './ImagePreview';


export default function GalleryManager() {
    const [images, setImages] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc');
    const [selectedCategory, setSelectedCategory] = useState('Tout');
    const [loading, setLoading] = useState(true);
  
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
  
    const getSortedAndFilteredImages = () => {
      let filtered = selectedCategory === 'Tout'
        ? images
        : images.filter(img => img.category === selectedCategory);
  
      return filtered.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.price - b.price;
        }
        return b.price - a.price;
      });
    };
  
    return (
      <div className="space-y-4">
        <GalleryFilters
          onSort={setSortOrder}
          onFilter={setSelectedCategory}
          sortOrder={sortOrder}
          selectedCategory={selectedCategory}
        />
  
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {getSortedAndFilteredImages().map((image) => (
              <ImageCard
                key={image.id}
                image={image}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
  
        <ImagePreview
          image={selectedImage}
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    );
  }