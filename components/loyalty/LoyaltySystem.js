import { useState, useEffect,useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Star, Award, Gift, Trophy} from 'lucide-react';

const TIERS = {
  BRONZE: { name: 'Bronze', min: 0, max: 99, color: 'from-orange-400 to-orange-600' },
  SILVER: { name: 'Argent', min: 100, max: 249, color: 'from-gray-400 to-gray-600' },
  GOLD: { name: 'Or', min: 250, max: 499, color: 'from-yellow-400 to-yellow-600' },
  PLATINUM: { name: 'Platine', min: 500, max: Infinity, color: 'from-purple-400 to-purple-600' }
};

const REWARDS = [
  { id: 1, name: '-5€ sur votre prestation', points: 50, icon: Gift },
  { id: 2, name: '-10€ sur votre prestation', points: 100, icon: Gift },
  { id: 3, name: 'Pose complète offerte', points: 200, icon: Star },
  { id: 4, name: 'Remplissage offert', points: 150, icon: Star },
  { id: 5, name: 'Nail art gratuit', points: 75, icon: Trophy }
];

export default function LoyaltySystem() {
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [currentTier, setCurrentTier] = useState(null);
  const [nextTier, setNextTier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [redeemLoading, setRedeemLoading] = useState(false);
  
  const loadLoyaltyData = useCallback(async () => {
    try {
      const res = await fetch('/api/user/loyalty');
      if (!res.ok) throw new Error('Erreur de chargement');
      
      const data = await res.json();
      setPoints(data.points);
      updateTiers(data.points);
    } catch (error) {
      setError('Impossible de charger vos points fidélité');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadLoyaltyData();
    }
  }, [user,loadLoyaltyData]);

  const updateTiers = (pointsAmount) => {
    const current = Object.values(TIERS).find(
      tier => pointsAmount >= tier.min && pointsAmount <= tier.max
    );
    const next = Object.values(TIERS).find(
      tier => tier.min > pointsAmount
    );
    
    setCurrentTier(current);
    setNextTier(next);
  };
  const handleRedeemReward = async (reward) => {
    try {
      setRedeemLoading(true);
      const res = await fetch('/api/user/loyalty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          points: -reward.points,
          reason: `Récompense utilisée: ${reward.name}`
        })
      });
  
      if (res.ok) {
        const data = await res.json();
        setPoints(data.points);
        updateTiers(data.points);
        alert(`Récompense "${reward.name}" utilisée avec succès !`);
      }
    } catch (error) {
      setError('Erreur lors de l\'utilisation de la récompense');
    } finally {
      setRedeemLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }
  const addTestPoints = async () => {
    try {
      const res = await fetch('/api/user/loyalty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          points: 50,
          reason: 'Test: Points ajoutés'
        })
      });
  
      if (res.ok) {
        const data = await res.json();
        setPoints(data.points);
        updateTiers(data.points);
        showPoints(50, 'earned');
      }
    } catch (error) {
      console.error('Error adding points:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Carte de niveau actuel */}
      <div className={`bg-gradient-to-r ${currentTier?.color} p-6 rounded-lg text-white`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold mb-2">{currentTier?.name}</h3>
            <p className="text-lg">{points} points</p>
          </div>
          <Award size={32} />
        </div>
        {nextTier && (
          <div className="mt-4">
            <p>Plus que {nextTier.min - points} points pour atteindre le niveau {nextTier.name}</p>
            <div className="w-full bg-white/30 rounded-full h-2 mt-2">
              <div 
                className="bg-white rounded-full h-2"
                style={{ width: `${(points - currentTier.min) / (currentTier.max - currentTier.min) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Récompenses disponibles */}
      <div className="grid md:grid-cols-2 gap-6">
        {REWARDS.map(reward => {
          const RewardIcon = reward.icon;
          const isAvailable = points >= reward.points;
          
          return (
            <div 
              key={reward.id}
              className={`p-4 rounded-lg border transition-all ${
                isAvailable 
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <RewardIcon 
                  size={24}
                  className={isAvailable ? 'text-pink-500' : 'text-gray-400'}
                />
                <div>
                  <h4 className="font-semibold">{reward.name}</h4>
                  <p className={`text-sm ${isAvailable ? 'text-pink-600' : 'text-gray-500'}`}>
                    {reward.points} points requis
                  </p>
                </div>
              </div>
              <button
                onClick={() => isAvailable && handleRedeemReward(reward)}
                disabled={!isAvailable || redeemLoading}
                className={`w-full mt-3 py-2 px-4 rounded-lg transition-colors ${
                  isAvailable
                    ? 'bg-pink-500 text-white hover:bg-pink-600'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                } ${redeemLoading ? 'opacity-50' : ''}`}
              >
                {redeemLoading ? 'Chargement...' : isAvailable ? 'Utiliser' : `Encore ${reward.points - points} points nécessaires`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Comment gagner des points */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Star size={20} className="text-pink-500" />
          Comment gagner des points ?
        </h3>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-pink-500" />
            <span>10 points pour chaque prestation réalisée</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-pink-500" />
            <span>5 points bonus pour un parrainage</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-pink-500" />
            <span>2 points pour un avis laissé</span>
          </li>
        </ul>
      </div>
      <button
  /*onClick={addTestPoints}
  className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
*/></button>
    </div>
  );
}