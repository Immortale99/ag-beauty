// pages/api/admin/users.js
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

  try {
    const users = await prisma.user.findMany({
      orderBy: {
        points: 'desc'
      }
    });

    return res.status(200).json({ users });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}