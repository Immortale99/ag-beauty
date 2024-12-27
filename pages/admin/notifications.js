// pages/admin/notifications.js
import { useAuth } from '../../hooks/useAuth';
import NotificationManager from '../../components/admin/NotificationManager';

export default function NotificationsAdmin() {
  const { user } = useAuth();

  if (!user || user.email !== 'info@repair-smartphone.fr') {
    return (
      <div className="p-8 text-center">
        <p>Accès non autorisé</p>
      </div>
    );
  }

  return <NotificationManager />;
}