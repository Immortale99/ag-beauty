import { useEffect, useRef } from 'react';

export function useNotifications() {
  const audioRef = useRef(new Audio('/sounds/notification.mp3'));

  const playNotification = () => {
    audioRef.current.play().catch(err => console.log('Erreur audio:', err));
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  const sendNotification = (title, body) => {
    playNotification();
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/icons/icon-192x192.png'
      });
    }
  };

  return {
    sendNotification,
    requestNotificationPermission,
  };
}