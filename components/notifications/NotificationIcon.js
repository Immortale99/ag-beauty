// components/notifications/NotificationIcon.js
import { Bell } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function NotificationIcon({ onClick }) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadUnreadCount();
  }, []);

  const loadUnreadCount = async () => {
    try {
      const res = await fetch('/api/notifications/unread-count');
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  return (
    <button 
      onClick={onClick}
      className="relative p-2 text-gray-500 hover:text-pink-500"
    >
      <Bell size={20} />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </button>
  );
}