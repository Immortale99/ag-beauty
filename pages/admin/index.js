// pages/admin/index.js
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Star, Image, BookOpen, Bell } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user || user.email !== 'info@repair-smartphone.fr') {
    return (
      <div className="p-8 text-center">
        <p>Accès non autorisé</p>
      </div>
    );
  }

  const adminSections = [
    {
      title: "Points de Fidélité",
      description: "Gérer les points des clients",
      href: "/admin/points",
      icon: Star,
      color: "text-yellow-500"
    },
    {
      title: "Galerie",
      description: "Gérer les images de réalisations",
      href: "/admin/gallery",
      icon: Image,
      color: "text-pink-500"
    },
    {
      title: "Blog",
      description: "Gérer les articles du blog",
      href: "/admin/blog",
      icon: BookOpen,
      color: "text-blue-500"
    },
    {
      title: "Notifications",
      description: "Gérer les notifications",
      href: "/admin/notifications",
      icon: Bell,
      color: "text-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Dashboard Administration</h1>

        <div className="grid gap-6 md:grid-cols-2">
          {adminSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <Link 
                key={section.href}
                href={section.href}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`${section.color}`}>
                    <IconComponent size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{section.title}</h2>
                    <p className="text-gray-600 mt-1">{section.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}