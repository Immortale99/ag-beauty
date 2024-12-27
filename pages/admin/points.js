// pages/admin/points.js
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/router';
import { Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PointsAdmin() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [pointsToAdd, setPointsToAdd] = useState('');
  const [reason, setReason] = useState('');

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
      console.error('Erreur chargement utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPoints = async (userId, amount, reason) => {
    try {
      const result = await pointsService.handlePoints(
        userId,
        amount,
        reason
      );
      
      // Mise à jour de l'interface après l'ajout des points
      console.log('Nouveaux points:', result.points);
      console.log('Nouveau tier:', result.tier);
      
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold">Gestion des Points</h1>
      </div>

      {/* Recherche */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un client..."
            className="w-full p-3 border rounded-lg pl-10"
          />
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div className="space-y-4 mb-8">
        {loading ? (
          <div className="text-center">Chargement...</div>
        ) : filteredUsers.map(user => (
          <div 
            key={user.id}
            className={`p-4 bg-white rounded-lg shadow cursor-pointer ${
              selectedUser?.id === user.id ? 'border-2 border-pink-500' : ''
            }`}
            onClick={() => setSelectedUser(user)}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{user.name || user.email}</p>
                <p className="text-sm text-gray-500">{user.points} points</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Niveau: {user.tier}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Formulaire d'ajout de points */}
      {selectedUser && (
        <form onSubmit={handleAddPoints} className="bg-white p-6 rounded-lg shadow space-y-4">
          <h3 className="font-semibold mb-4">
            Ajouter des points pour {selectedUser.name || selectedUser.email}
          </h3>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Nombre de points
            </label>
            <input
              type="number"
              value={pointsToAdd}
              onChange={(e) => setPointsToAdd(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Raison
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Ex: Parrainage, Prestation..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-500 text-white p-3 rounded-lg hover:bg-pink-600"
          >
            Ajouter les points
          </button>
        </form>
      )}
    </div>
  );
}