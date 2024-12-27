import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Camera, Home, Calendar, User, Instagram, Facebook, Phone, Settings, BookOpen, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Gallery from '../components/Gallery';
import Profile from '../components/Profile';
import BookingSystem from '../components/BookingSystem';
import HomeContent from '../components/HomeContent';
import BlogList from '../components/blog/BlogList';
import ReferralSystem from '../components/referral/ReferralSystem';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import NotificationIcon from '../components/notifications/NotificationIcon';
import NotificationPanel from '../components/notifications/NotificationPanel';
import Link from 'next/link';

export default function AGBeauty() {
  const [activeTab, setActiveTab] = useState('accueil');
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const navigationItems = [
    { id: 'accueil', icon: Home, label: 'Accueil' },
    { id: 'galerie', icon: Camera, label: 'Galerie' },
    { id: 'blog', icon: BookOpen, label: 'Blog' },
    ...(user ? [
      { id: 'reservation', icon: Calendar, label: 'Réservation' },
      { id: 'profil', icon: User, label: 'Mon Espace' },
      { id: 'parrainage', icon: Users, label: 'Parrainage' },
      ...(user.email === 'info@repair-smartphone.fr' ? [
        { id: 'admin', icon: Settings, label: 'Administration' }
      ] : [])
    ] : [])
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="min-h-screen bg-gray-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <header className="bg-white shadow sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">AG - BEAUTY</h1>
              <div className="flex items-center space-x-4">
                {user && <NotificationIcon onClick={() => setShowNotifications(true)} />}
                <a 
                  href="https://www.instagram.com/agbeauty42/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-500 hover:text-pink-500"
                >
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-gray-500 hover:text-pink-500">
                  <Facebook size={20} />
                </a>
                <a href="tel:+33626028745" className="text-gray-500 hover:text-pink-500">
                  <Phone size={20} />
                </a>
                {user ? (
                  <button
                    onClick={logout}
                    className="text-sm text-gray-600 hover:text-pink-500"
                  >
                    Déconnexion
                  </button>
                ) : (
                  <button
                    onClick={() => router.push('/login')}
                    className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
                  >
                    Connexion
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        
        <nav className="bg-white border-b sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-4 overflow-x-auto">
              {navigationItems.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === id
                      ? 'border-pink-500 text-pink-500'
                      : 'border-transparent text-gray-600 hover:text-pink-500'
                  }`}
                >
                  <Icon size={20} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        <motion.main 
          className="max-w-7xl mx-auto py-6 px-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {activeTab === 'accueil' && (
              <motion.div
                key="accueil"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <HomeContent />
              </motion.div>
            )}
            
            {activeTab === 'galerie' && (
              <motion.div
                key="galerie"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Gallery />
              </motion.div>
            )}
            {activeTab === 'blog' && (
              <motion.div
                key="blog"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <BlogList />
              </motion.div>
            )}
            {activeTab === 'reservation' && user && (
              <motion.div
                key="reservation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <BookingSystem />
              </motion.div>
            )}
            {activeTab === 'profil' && user && (
              <motion.div
                key="profil"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Profile />
              </motion.div>
            )}
            {activeTab === 'parrainage' && user && (
              <motion.div
                key="parrainage"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <ReferralSystem />
              </motion.div>
            )}
            {activeTab === 'admin' && user?.email === 'info@repair-smartphone.fr' && (
              <motion.div
                key="admin"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Administration</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Link 
                      href="/admin/blog"
                      className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                      <h3 className="text-xl font-semibold mb-2">Gestion du Blog</h3>
                      <p className="text-gray-600">Gérer les articles et catégories du blog</p>
                    </Link>
                    <Link 
                      href="/admin/blog/categories"
                      className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                      <h3 className="text-xl font-semibold mb-2">Catégories</h3>
                      <p className="text-gray-600">Gérer les catégories du blog</p>
                    </Link>
                    <Link 
                      href="/admin/gallery"
                      className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                      <h3 className="text-xl font-semibold mb-2">Gestion de la Galerie</h3>
                      <p className="text-gray-600">Ajouter et gérer vos photos</p>
                    </Link>
                    <Link 
                     href="/admin/points"
                     className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                     >
                     <h3 className="text-xl font-semibold mb-2">Gestion des Points</h3>
                     <p className="text-gray-600">Gérer les points et parrainages des clients</p>
                    </Link>
                    <Link 
                     href="/admin/notifications"
                     className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-xl font-semibold mb-2">Notifications</h3>
                    <p className="text-gray-600">Envoyer des notifications aux utilisateurs</p>
                     </Link>
                  </div>
                </div>
              </motion.div>
            )}
         </AnimatePresence>
        </motion.main>
        <NotificationPanel 
          isOpen={showNotifications} 
          onClose={() => setShowNotifications(false)} 
        />
      </motion.div>
    </AnimatePresence>
  );
}