import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Camera, Upload, X, Edit2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';


export default function GalleryAdmin() {
  const { user } = useAuth();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Tout');
  
  const categories = ['Nail Art', 'French', 'Gel', 'Déco'];

  // État pour le formulaire d'ajout

  useEffect(() => {
    loadImages();
  }, []);
  
  const loadImages = async () => {
    setLoading(true);
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

  const handleDelete = async (imageId) => {
    if (!confirm('Voulez-vous vraiment supprimer cette image ?')) return;
    
    try {
      const res = await fetch(`/api/gallery/images/${imageId}`, {
        method: 'DELETE',
      });
  
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      
      setImages(prev => prev.filter(img => img.id !== imageId));
    } catch (error) {
      setError('Erreur lors de la suppression de l\'image');
    }
  };
  
  // Modification de la catégorie
  const handleCategoryChange = async (imageId, newCategory) => {
    try {
      const res = await fetch(`/api/gallery/images/${imageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: newCategory })
      });
  
      if (!res.ok) throw new Error('Erreur lors de la modification');
  
      setImages(prev => prev.map(img => 
        img.id === imageId ? { ...img, category: newCategory } : img
      ));
    } catch (error) {
      setError('Erreur lors de la modification de la catégorie');
    }
  };
  
  // Tri des images
  const [sortBy, setSortBy] = useState('date'); // 'date' ou 'category'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' ou 'desc'
  
  const getSortedImages = () => {
    return [...images].sort((a, b) => {
      if (sortBy === 'date') {
        const comparison = new Date(b.createdAt) - new Date(a.createdAt);
        return sortOrder === 'desc' ? comparison : -comparison;
      }
      if (sortBy === 'category') {
        const comparison = a.category.localeCompare(b.category);
        return sortOrder === 'desc' ? -comparison : comparison;
      }
      return 0;
    });
  };

  const [newImage, setNewImage] = useState({
    category: categories[0],
    price: '',
    description: ''
  });

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage({
          preview: e.target.result,
          file: file
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage || !newImage.price) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', selectedImage.file);
    formData.append('category', newImage.category);
    formData.append('price', newImage.price);
    formData.append('description', newImage.description);

    try {
      const res = await fetch('/api/gallery/upload', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('Erreur upload');

      const data = await res.json();
      setImages(prev => [data.image, ...prev]);
      setSelectedImage(null);
      setNewImage({ category: categories[0], price: '', description: '' });
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* En-tête fixe */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
  <div className="max-w-xl mx-auto px-4 py-4 flex items-center justify-between">
    <h1 className="text-xl font-bold">Ajouter une réalisation</h1>
    <Link 
      href="/"
      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
    >
      Retour
    </Link>
  </div>
</div>

      <div className="max-w-xl mx-auto px-4 pt-16">
        {/* Section upload */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          {selectedImage ? (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={selectedImage.preview}
                  alt="Preview"
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={newImage.category}
                    onChange={(e) => setNewImage(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix
                  </label>
                  <input
                    type="number"
                    value={newImage.price}
                    onChange={(e) => setNewImage(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="45"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (optionnelle)
                  </label>
                  <textarea
                    value={newImage.description}
                    onChange={(e) => setNewImage(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Détails de la réalisation..."
                    className="w-full p-2 border rounded-lg h-20"
                  />
                </div>

                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className="w-full bg-pink-500 text-white p-3 rounded-lg font-medium disabled:opacity-50"
                >
                  {loading ? 'Publication...' : 'Publier'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                ref={fileInputRef}
                className="hidden"
                capture="environment"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-500"
              >
                <div className="flex flex-col items-center">
                  <Camera className="w-12 h-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Prendre une photo ou choisir une image
                  </p>
                </div>
              </button>
            </div>
          )}
        </div>

         {/* Liste des images */}
      <div className="grid grid-cols-2 gap-4">
        {images.map((image) => (
          <div key={image.id} className="relative group">
            <Image
              src={image.url}
              alt={image.description || 'Réalisation'}
              width={400}
              height={400}
              className="w-full aspect-square object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg p-4">
              <button 
                onClick={() => handleDelete(image.id)}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-bold">{image.category}</p>
                <p className="text-white">{image.price}€</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Barre d'action fixe en bas */}
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
      <div className="max-w-xl mx-auto">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full bg-pink-500 text-white p-4 rounded-lg font-medium flex items-center justify-center gap-2"
        >
          <Camera size={20} />
          Ajouter une photo
        </button>
      </div>
    </div>
  </div>
);
}