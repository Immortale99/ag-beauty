// pages/api/notifications/[id]/read.js
import prisma from '../../../../lib/prisma';
import { parseCookies } from 'nookies';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const cookies = parseCookies({ req });
  const userCookie = cookies.user;

  if (!userCookie) {
    return res.status(401).json({ error: 'Non authentifié' });
  }

  const user = JSON.parse(userCookie);
  const { id } = req.query;

  try {
    await prisma.notification.update({
      where: {
        id: id,
        userId: user.id
      },
      data: {
        isRead: true
      }
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}