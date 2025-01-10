import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Star, Heart } from 'lucide-react';
import LoyaltySystem from './loyalty/LoyaltySystem';


export default function Profile() {
  const { user, isLoading: authLoading } = useAuth();
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/user/profile');
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erreur serveur');
      }

      const data = await res.json();
      setPoints(data.points || 0);
      setError(null);
    } catch (error) {
      console.error("Profile error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Veuillez vous connecter pour accéder à votre espace</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        <p>{error}</p>
        <button 
          onClick={loadProfileData} 
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Mon Espace</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Carte de points */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 rounded-lg text-white">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg mb-2">Carte de fidélité</h3>
              <p className="text-sm opacity-120">{user.email}</p>
            </div>
            <Star size={24} />
          </div>
          <div className="mt-6">
            <p className="text-2xl font-bold">{points} points</p>
            <p className="text-sm opacity-90">{user.name}</p>
          </div>
        </div>

        {/* Prestations favorites */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Heart size={20} className="text-pink-500" />
            Mes prestations favorites
          </h3>
          <div className="space-y-3">
          <LoyaltySystem />
            {[
              { name: 'French manucure', price: '40€' },
              { name: 'Nail art fleurs', price: '15€' },
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <p>{item.name}</p>
                <p className="font-bold">{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}