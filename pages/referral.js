// pages/referral.js
import { useAuth } from '../hooks/useAuth';
import ReferralSystem from '../components/referral/ReferralSystem';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ReferralPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p>Veuillez vous connecter pour accéder au système de parrainage.</p>
        <Link 
          href="/login" 
          className="inline-block mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link 
          href="/" 
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold">Parrainage</h1>
      </div>

      <ReferralSystem />
    </div>
  );
}