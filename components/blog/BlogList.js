// components/blog/BlogList.js
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Charger les articles
        const postsRes = await fetch('/api/blog/posts/public');
        const postsData = await postsRes.json();
        
        if (!postsData.posts) {
          console.log('Données reçues:', postsData);
          throw new Error('Format de données invalide');
        }
        
        setPosts(postsData.posts);

        // Charger les catégories
        const categoriesRes = await fetch('/api/blog/categories');
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.categories || []);

      } catch (error) {
        console.error('Erreur de chargement:', error);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  // Vérification que posts existe et est un tableau
  if (!Array.isArray(posts)) {
    return (
      <div className="text-center py-8">
        Aucun article disponible
      </div>
    );
  }

  const filteredPosts = selectedCategory
    ? posts.filter(post => post.categories?.some(cat => cat.id === selectedCategory))
    : posts;

  return (
    <div className="space-y-8">
      {/* Filtres par catégorie */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full ${
            !selectedCategory
              ? 'bg-pink-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Tout
        </button>
        {Array.isArray(categories) && categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full ${
              selectedCategory === category.id
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {category.name}
            <span className="ml-2 text-sm">
              ({posts.filter(post => post.categories?.some(cat => cat.id === category.id)).length})
            </span>
          </button>
        ))}
      </div>

      {/* Liste des articles */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            {post.image && (
              <img 
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-3">
                {post.categories?.map(category => (
                  <span 
                    key={category.id}
                    className="px-2 py-1 text-xs bg-pink-100 text-pink-600 rounded-full"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
              <h2 className="text-xl font-semibold mb-2">
                <Link href={`/blog/${post.slug}`} className="hover:text-pink-500 transition-colors">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex justify-between items-center">
                <Link 
                  href={`/blog/${post.slug}`}
                  className="text-pink-500 hover:text-pink-600 font-medium"
                >
                  Lire la suite →
                </Link>
                <span className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucun article trouvé dans cette catégorie
        </div>
      )}
    </div>
  );
}