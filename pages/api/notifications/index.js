// pages/api/notifications/index.js
import prisma from '../../../lib/prisma';
import { parseCookies } from 'nookies';

export default async function handler(req, res) {
  const cookies = parseCookies({ req });
  const userCookie = cookies.user;

  if (!userCookie) {
    return res.status(401).json({ error: 'Non authentifié' });
  }

  const user = JSON.parse(userCookie);

  if (req.method === 'GET') {
    try {
      const notifications = await prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      });
      
      return res.status(200).json({ notifications });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}