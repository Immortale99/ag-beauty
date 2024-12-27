import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Plus, Edit, Trash, Save, X } from 'lucide-react';
import Link from 'next/link';

export default function Categories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  const [editName, setEditName] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await fetch('/api/blog/categories');
      if (!res.ok) throw new Error('Erreur chargement catégories');
      const data = await res.json();
      setCategories(data.categories);
    } catch (error) {
      setError('Erreur chargement des catégories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      const res = await fetch('/api/blog/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory })
      });

      if (res.ok) {
        setNewCategory('');
        loadCategories();
      }
    } catch (error) {
      setError('Erreur lors de la création');
    }
  };

  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`/api/blog/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName })
      });

      if (res.ok) {
        setEditingId(null);
        loadCategories();
      }
    } catch (error) {
      setError('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Voulez-vous vraiment supprimer cette catégorie ?')) return;

    try {
      const res = await fetch(`/api/blog/categories/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        loadCategories();
      }
    } catch (error) {
      setError('Erreur lors de la suppression');
    }
  };

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p>Veuillez vous connecter pour accéder à la gestion des catégories.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Gestion des catégories</h1>
        <Link 
          href="/admin/blog"
          className="text-gray-600 hover:text-gray-900"
        >
          Retour aux articles
        </Link>
      </div>

      {error && (
        <div className="p-4 mb-4 bg-red-50 text-red-500 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleCreate} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nouvelle catégorie"
            className="flex-1 p-2 border rounded-lg"
            required
          />
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            <Plus size={20} />
            Ajouter
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-pink-500 border-t-transparent"></div>
          </div>
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-500 p-4">Aucune catégorie</p>
        ) : (
          categories.map((category) => (
            <div 
              key={category.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
            >
              {editingId === category.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 p-2 border rounded-lg"
                  />
                  <button
                    onClick={() => handleUpdate(category.id)}
                    className="text-green-500 hover:text-green-700"
                  >
                    <Save size={20} />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <>
                  <span>{category.name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingId(category.id);
                        setEditName(category.name);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash size={20} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}