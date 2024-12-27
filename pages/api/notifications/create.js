// pages/api/notifications/create.js
import prisma from '../../../lib/prisma';
import { parseCookies } from 'nookies';

export default async function handler(req, res) {
  const cookies = parseCookies({ req });
  const userCookie = cookies.user;

  if (!userCookie) {
    return res.status(401).json({ error: 'Non authentifié' });
  }

  const admin = JSON.parse(userCookie);
  if (admin.email !== 'info@repair-smartphone.fr') {
    return res.status(403).json({ error: 'Non autorisé' });
  }

  if (req.method === 'POST') {
    const { userId, title, message, type } = req.body;

    try {
      const notification = await prisma.notification.create({
        data: {
          userId,
          title,
          message,
          type
        }
      });

      return res.status(201).json(notification);
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}