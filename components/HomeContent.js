// components/HomeContent.js
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, Trash,ChevronDown, ChevronUp } from 'lucide-react';
import TouchCard from './ui/TouchCard';
import { useToast } from '../contexts/ToastContext';
import ReviewForm from './reviews/ReviewForm';
import { useAuth } from '../hooks/useAuth';  // Ajout de useAuth pour vérifier l'utilisateur
import { motion } from 'framer-motion';


export default function HomeContent() {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showAllServices, setShowAllServices] = useState(false);

  const mainServices = [
    { name: 'Pose complète', prix: '45€', duree: '2h15' },
    { name: 'Remplissage', prix: '35€', duree: '2h' },
    { name: 'Nail art', prix: '15€', duree: '30min' },
  ];

  const additionalServices = [
    { name: 'Dépose', prix: '20€', duree: '30min' },
    { name: 'Pose complète Baby Boomer', prix: '50€', duree: '2h' },
    { name: 'Réparation ongle', prix: '5€', duree: '15min' },
    // Ajoutez d'autres services ici
  ];


  useEffect(() => {
    loadReviews();
  }, []);
  useEffect(() => {
    loadReviews();
  }, []);
  
  const loadReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative h-64 rounded-xl overflow-hidden">
        <Image
          src="https://picsum.photos/1200/400"
          alt="AG - BEAUTY Banner"
          className="w-full h-full object-cover"
          width={1200}
          height={400}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/80 to-transparent flex items-center">
          <div className="text-white p-8">
            <h2 className="text-3xl font-bold mb-2">AG - BEAUTY</h2>
            <p className="text-xl">L'art de la beauté à votre service</p>
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-4">Nos services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mainServices.map((service, index) => (
            <TouchCard key={index}
               className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-2">{service.name}</h3>
              <p className="text-pink-500 font-bold text-xl">{service.prix}</p>
              <p className="text-gray-500 text-sm">Durée : {service.duree}</p>
              </TouchCard>
               ))}
             </div>


        {/* Section dépliable */}
        <div className="mt-4">
          <button
            onClick={() => setShowAllServices(!showAllServices)}
            className="flex items-center justify-center w-full gap-2 py-2 text-gray-600 hover:text-pink-500 transition-colors"
          >
            {showAllServices ? (
              <>
                Voir moins <ChevronUp size={20} />
              </>
            ) : (
              <>
                Voir plus de services <ChevronDown size={20} />
              </>
            )}
          </button>
            
          {showAllServices && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
            >
              {additionalServices.map((service, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-bold text-lg mb-2">{service.name}</h3>
                  <p className="text-pink-500 font-bold text-xl">{service.prix}</p>
                  <p className="text-gray-500 text-sm">Durée : {service.duree}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <section>
       <div className="flex justify-between items-center mb-4">
       <h2 className="text-2xl font-bold">Avis clients</h2>
       {user && (
        <button
        onClick={() => setShowReviewForm(true)}
        className="text-pink-500 hover:text-pink-600"
      >
        Donner mon avis
      </button>
    )}
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {reviews.map((review) => (
    <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm relative">
      {user?.email === 'info@repair-smartphone.fr' && (
        <button
          onClick={async () => {
            if (window.confirm('Voulez-vous vraiment supprimer cet avis ?')) {
              try {
                const res = await fetch(`/api/reviews/${review.id}`, {
                  method: 'DELETE'
                });
                if (res.ok) {
                  setReviews(reviews.filter(r => r.id !== review.id));
                }
              } catch (error) {
                console.error('Error deleting review:', error);
              }
            }
          }}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1"
        >
          <Trash size={16} />
        </button>
      )}
      <div className="flex text-yellow-400 mb-2">
        {Array.from({ length: review.rating }).map((_, i) => (
          <Star key={i} size={20} fill="currentColor" />
        ))}
      </div>
      <p className="mb-2">"{review.comment}"</p>
      <p className="text-gray-500 text-sm">- {review.user.name || 'Client'}</p>
      <p className="text-gray-400 text-xs mt-1">
        {new Date(review.createdAt).toLocaleDateString('fr-FR')}
      </p>
    </div>
  ))}
</div>
  
  {/* Modal pour le formulaire d'avis */}
  {showReviewForm && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="max-w-md w-full mx-4">
        <ReviewForm 
          onSubmit={(newReview) => {
            setReviews(prev => [newReview, ...prev]);
          }}
          onClose={() => setShowReviewForm(false)}
        />
      </div>
    </div>
  )}
</section>
      
    </div>
  );
}