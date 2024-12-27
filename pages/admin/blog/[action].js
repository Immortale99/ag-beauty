import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../hooks/useAuth';
import { Image, Save, X } from 'lucide-react';
import Link from 'next/link';

export default function BlogEditor() {
  const router = useRouter();
  const { action, id } = router.query;
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  
  const [post, setPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    published: false,
    categories: []
  });

  useEffect(() => {
    loadCategories();
    if (id && action === 'edit') {
      loadPost(id);
    }
  }, [id, action]);

  const loadCategories = async () => {
    try {
      const res = await fetch('/api/blog/categories');
      if (!res.ok) throw new Error('Erreur chargement catégories');
      const data = await res.json();
      setCategories(data.categories);
    } catch (error) {
      setError('Erreur chargement des catégories');
    }
  };

  const loadPost = async (postId) => {
    try {
      const res = await fetch(`/api/blog/posts/${postId}`);
      if (!res.ok) throw new Error('Erreur chargement article');
      const data = await res.json();
      setPost(data.post);
    } catch (error) {
      setError('Erreur chargement de l\'article');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = action === 'edit' 
        ? `/api/blog/posts/${id}`
        : '/api/blog/posts';
      
      const method = action === 'edit' ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      });

      if (!res.ok) throw new Error('Erreur sauvegarde');

      router.push('/admin/blog');
    } catch (error) {
      setError('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/blog/upload', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('Erreur upload');

      const data = await res.json();
      setPost({ ...post, image: data.url });
    } catch (error) {
      setError('Erreur lors de l\'upload de l\'image');
    }
  };

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p>Veuillez vous connecter pour accéder à l'édition.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">
          {action === 'edit' ? 'Modifier l\'article' : 'Nouvel article'}
        </h1>
        <Link 
          href="/admin/blog"
          className="text-gray-600 hover:text-gray-900"
        >
          <X size={24} />
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 text-red-500 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre
          </label>
          <input
            type="text"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catégories
          </label>
          <select
            multiple
            value={post.categories.map(c => c.id)}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions, option => option.value);
              setPost({
                ...post,
                categories: values.map(id => ({ id }))
              });
            }}
            className="w-full p-2 border rounded-lg"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Extrait
          </label>
          <textarea
            value={post.excerpt}
            onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
            className="w-full p-2 border rounded-lg h-24"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contenu
          </label>
          <textarea
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
            className="w-full p-2 border rounded-lg h-64"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center gap-2 cursor-pointer bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200">
              <altImage size={20} />
              <span>Choisir une image</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
            {post.image && (
              <img 
                src={post.image} 
                alt="Aperçu" 
                className="h-20 w-20 object-cover rounded"
              />
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={post.published}
              onChange={(e) => setPost({ ...post, published: e.target.checked })}
              className="rounded text-pink-500"
            />
            <span className="text-sm text-gray-700">Publier l'article</span>
          </label>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/admin/blog"
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50"
          >
            <Save size={20} />
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}