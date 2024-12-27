// pages/api/notifications/clear.js
import prisma from '../../../lib/prisma';
import { parseCookies } from 'nookies';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const cookies = parseCookies({ req });
  const userCookie = cookies.user;

  if (!userCookie) {
    return res.status(401).json({ error: 'Non authentifié' });
  }

  const user = JSON.parse(userCookie);

  try {
    // Supprimer toutes les notifications lues de l'utilisateur
    await prisma.notification.deleteMany({
      where: {
        userId: user.id,
        isRead: true
      }
    });

    return res.status(200).json({ message: 'Notifications supprimées' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}