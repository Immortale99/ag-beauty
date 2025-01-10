/*// pages/settings.js
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Link from 'next/link';
import { 
  User, 
  Bell, 
  Star, 
  ChevronRight,
  ArrowLeft,
  Shield,
  HelpCircle,
  LogOut
} from 'lucide-react';

export default function Settings() {
  const { user, logout } = useAuth();

  const settingsSections = [
    {
      title: "Profil",
      icon: User,
      href: "/profile",
      description: "Gérer vos informations personnelles"
    },
    {
      title: "Notifications",
      icon: Bell,
      href: "/notifications",
      description: "Gérer vos préférences de notifications"
    },
    {
      title: "Points de fidélité",
      icon: Star,
      href: "/loyalty",
      description: "Voir votre historique de points"
    },
    {
      title: "Confidentialité",
      icon: Shield,
      href: "/privacy",
      description: "Gérer vos paramètres de confidentialité"
    },
    {
      title: "Aide",
      icon: HelpCircle,
      href: "/help",
      description: "Centre d'aide et support"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header *//*}
      /*<div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-xl font-bold">Paramètres</h1>
          </div>
        </div>
      </div>

      {/* Content *//*}
      /*<div className="max-w-lg mx-auto px-4 pt-20 pb-8">
        {/* Profil rapide *//*}
        /*<div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={32} className="text-gray-500" />
            </div>
            <div>
              <h2 className="font-semibold">{user?.email}</h2>
              <p className="text-sm text-gray-500">
                {user?.points || 0} points de fidélité
              </p>
            </div>
          </div>
        </div>

        {/* Sections de paramètres *//*}
        /*<div className="space-y-4">
          {settingsSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <Link
                key={section.href}
                href={section.href}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <IconComponent className="w-6 h-6 text-gray-500" />
                  <div>
                    <h3 className="font-medium">{section.title}</h3>
                    <p className="text-sm text-gray-500">{section.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            );
          })}
        </div>

        {/* Bouton de déconnexion *//*}
        /*<button
          onClick={logout}
          className="mt-8 w-full flex items-center justify-center gap-2 p-4 text-red-500 bg-white rounded-lg shadow hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          <span>Se déconnecter</span>
        </button>
      </div>
    </div>*/
/*);
/*}*/
