// components/gallery/GalleryAdmin.js
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Edit2, Trash, Save, X, Upload } from 'lucide-react';

export default function GalleryAdmin() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingImage, setEditingImage] = useState(null);
  const fileInputRef = useRef(null);
  const categories = ['Nail Art', 'French', 'Gel', 'Déco'];

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

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', 'Nail Art');
    formData.append('price', '0');

    try {
      const res = await fetch('/api/gallery/upload', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        loadImages();
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleDelete = async (imageId) => {
    if (!confirm('Voulez-vous vraiment supprimer cette image ?')) return;

    try {
      const res = await fetch(`/api/gallery/images/${imageId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        loadImages();
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestion de la Galerie</h1>

      {/* Upload section */}
      <div className="mb-8">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          className="hidden"
          accept="image/*"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
        >
          <Upload size={20} />
          Ajouter une photo
        </button>
      </div>

      {/* Images grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative aspect-square">
              <Image
                src={image.url}
                alt={image.description || 'Image'}
                fill
                className="object-cover rounded-lg"
              />
              {editingImage?.id === image.id ? (
                <EditForm
                  image={image}
                  onSave={async (data) => {
                    try {
                      const res = await fetch(`/api/gallery/images/${image.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                      });

                      if (res.ok) {
                        loadImages();
                        setEditingImage(null);
                      }
                    } catch (error) {
                      console.error('Update error:', error);
                    }
                  }}
                  onCancel={() => setEditingImage(null)}
                  categories={categories}
                />
              ) : (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity p-4">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingImage(image)}
                      className="p-2 bg-white/20 rounded-full hover:bg-white/30"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="p-2 bg-red-500/50 rounded-full hover:bg-red-500/70"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-bold">{image.price}€</p>
                    <p className="text-white text-sm">{image.category}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EditForm({ image, onSave, onCancel, categories }) {
  const [data, setData] = useState({
    category: image.category,
    price: image.price,
    description: image.description || ''
  });

  return (
    <div className="absolute inset-0 bg-black/75 p-4 flex flex-col rounded-lg">
      <select
        value={data.category}
        onChange={e => setData({ ...data, category: e.target.value })}
        className="mb-2 p-2 bg-white/20 text-white rounded border border-white/40"
      >
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <input
        type="number"
        value={data.price}
        onChange={e => setData({ ...data, price: Number(e.target.value) })}
        placeholder="Prix"
        className="mb-2 p-2 bg-white/20 text-white rounded border border-white/40"
      />

      <textarea
        value={data.description}
        onChange={e => setData({ ...data, description: e.target.value })}
        placeholder="Description"
        className="mb-2 p-2 bg-white/20 text-white rounded border border-white/40 flex-grow"
      />

      <div className="flex justify-end space-x-2">
        <button
          onClick={onCancel}
          className="p-2 bg-gray-500/50 rounded-full"
        >
          <X size={20} />
        </button>
        <button
          onClick={() => onSave(data)}
          className="p-2 bg-green-500/50 rounded-full"
        >
          <Save size={20} />
        </button>
      </div>
    </div>
  );
}