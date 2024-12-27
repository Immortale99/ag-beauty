// components/notifications/NotificationPanel.js
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function NotificationPanel({ isOpen, onClose }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const res = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST'
      });
      if (res.ok) {
        setNotifications(prev => prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        ));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const clearReadNotifications = async () => {
    try {
      const res = await fetch('/api/notifications/clear', {
        method: 'DELETE'
      });
      if (res.ok) {
        loadNotifications();
      }
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-xl z-50"
          >
            <div className="flex justify-between items-center p-4 border-b">
             <h2 className="text-lg font-semibold">Notifications</h2>
              <div className="flex items-center gap-4"> {/* Augmenté l'espace entre les boutons */}
              {notifications.some(n => n.isRead) && (
              <button
              onClick={clearReadNotifications}
              className="text-sm text-red-500 hover:text-red-700 px-3 py-1 rounded-lg border border-red-500 hover:bg-red-50"
              >
              Supprimer les lues
              </button>
               )}
              <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700"
               >
             <X size={24} />
           </button>
          </div>
          </div>

            <div className="overflow-y-auto h-full pb-20">
              {loading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-pink-500 border-t-transparent" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                  Aucune notification
                </div>
              ) : (
                <div className="divide-y">
    {notifications.map(notification => (
      <div
        key={notification.id}
        onClick={() => markAsRead(notification.id)}
        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
          notification.isRead ? 'bg-white' : 'bg-pink-50'
        }`}
      >
        <h3 className="font-medium mb-1">{notification.title}</h3>
        <p className="text-sm text-gray-600">{notification.message}</p>
        <p className="text-xs text-gray-400 mt-2">
          {new Date(notification.createdAt).toLocaleDateString('fr-FR')}
        </p>
      </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}