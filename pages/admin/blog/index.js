// pages/admin/blog/index.js
import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { PlusCircle, Edit, Trash } from 'lucide-react';
import Link from 'next/link';

export default function BlogAdmin() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const res = await fetch('/api/blog/posts');
      if (!res.ok) throw new Error('Erreur chargement articles');
      const data = await res.json();
      setPosts(data.posts);
    } catch (error) {
      setError('Erreur chargement des articles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!confirm('Voulez-vous vraiment supprimer cet article ?')) return;

    try {
      const res = await fetch(`/api/blog/posts/${postId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        loadPosts();
      }
    } catch (error) {
      setError('Erreur lors de la suppression');
    }
  };

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p>Veuillez vous connecter pour accéder à l'administration.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Articles du Blog</h1>
        <div className="flex gap-4">
          <Link
            href="/admin/blog/categories"
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Gérer les catégories
          </Link>
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
          >
            <PlusCircle size={20} />
            Nouvel article
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-pink-500 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-4">{error}</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{post.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(post.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      post.published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.published ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/blog/edit/${post.id}`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit size={20} />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}