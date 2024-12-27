// pages/blog/index.js
import { useState, useEffect } from 'react';
import BlogList from '../../components/blog/BlogList';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await blogService.getPublishedPosts();
        setPosts(data);
      } catch (error) {
        console.error('Erreur chargement des articles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* En-tête de la page blog */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Le Blog AG Beauty</h1>
      </div>

      {/* Section de chargement ou liste des articles */}
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-pink-500 border-t-transparent"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucun article n'a été publié pour le moment.</p>
        </div>
      ) : (
        <BlogList posts={posts} />
      )}
    </div>
  );
}