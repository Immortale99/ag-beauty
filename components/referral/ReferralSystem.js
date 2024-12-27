// components/referral/ReferralSystem.js
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Share2, Users, Gift } from 'lucide-react';

export default function ReferralSystem() {
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadReferralCode();
    }
  }, [user]);

  const loadReferralCode = async () => {
    try {
      const res = await fetch('/api/user/referral/code');
      if (res.ok) {
        const data = await res.json();
        setReferralCode(data.referralCode);
      }
    } catch (error) {
      setError('Impossible de charger votre code de parrainage');
    } finally {
      setLoading(false);
    }
  };

  const shareCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AG Beauty - Code de parrainage',
          text: `Utilisez mon code de parrainage ${referralCode.code} sur AG Beauty et recevez 10 points de fidélité !`,
          url: window.location.origin
        });
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      // Fallback
      navigator.clipboard.writeText(referralCode.code);
      alert('Code copié dans le presse-papier !');
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-pink-500 border-t-transparent"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Section Mon Code */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Share2 className="text-pink-500" />
          Mon Code de Parrainage
        </h2>
        
        {referralCode && (
        <div className="space-y-4">
       <div className="flex items-center justify-between p-4 bg-pink-50 rounded-lg">
        <span className="font-mono text-xl">{referralCode.code}</span>
        <button 
        onClick={shareCode}
        className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
      >
        Partager
      </button>
    </div>
    <div className="space-y-2">
      <p className="text-sm text-gray-600">
        Partagez ce code avec vos amis. Ils recevront 10 points et vous gagnerez 20 points !
      </p>
      <p className="text-sm font-medium text-pink-600">
        ⚠️ Le code de parrainage ne peut être utilisé qu'en caisse lors du paiement.
      </p>
    </div>
  </div>
)}
      </div>

      {/* Section Avantages */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Users className="text-pink-500" />
          Avantages du Parrainage
        </h2>
        
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-pink-500"></div>
            <span>20 points offerts pour chaque filleul</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-pink-500"></div>
            <span>10 points offerts à vos filleuls</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-pink-500"></div>
            <span>Pas de limite de parrainages</span>
          </li>
        </ul>
      </div>
    </div>
  );
}