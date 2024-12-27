// components/admin/NotificationManager.js
import { useState, useEffect } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotificationManager() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('all');
  const [notification, setNotification] = useState({
    title: '',
    message: '',
    type: 'INFO'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (selectedUser === 'all') {
        // Envoyer à tous les utilisateurs
        await Promise.all(
          users.map(user =>
            fetch('/api/notifications/create', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: user.id,
                ...notification
              })
            })
          )
        );
      } else {
        // Envoyer à un utilisateur spécifique
        const res = await fetch('/api/notifications/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: selectedUser,
            ...notification
          })
        });

        if (!res.ok) throw new Error('Erreur envoi notification');
      }

      alert('Notification(s) envoyée(s) avec succès');
      setNotification({ title: '', message: '', type: 'INFO' });
      setSelectedUser('all');
    } catch (error) {
      alert('Erreur lors de l\'envoi de la notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold">Gestion des Notifications</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Destinataire
          </label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="all">Tous les utilisateurs</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name || user.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            value={notification.type}
            onChange={(e) => setNotification(prev => ({ ...prev, type: e.target.value }))}
            className="w-full p-2 border rounded-lg"
          >
            <option value="INFO">Information</option>
            <option value="PROMO">Promotion</option>
            <option value="POINTS">Points de fidélité</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre
          </label>
          <input
            type="text"
            value={notification.title}
            onChange={(e) => setNotification(prev => ({ ...prev, title: e.target.value }))}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea
            value={notification.message}
            onChange={(e) => setNotification(prev => ({ ...prev, message: e.target.value }))}
            className="w-full p-2 border rounded-lg h-32"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-pink-500 text-white p-3 rounded-lg hover:bg-pink-600 disabled:opacity-50"
        >
          <Send size={20} />
          {loading ? 'Envoi...' : 'Envoyer la notification'}
        </button>
      </form>
    </div>
  );
}