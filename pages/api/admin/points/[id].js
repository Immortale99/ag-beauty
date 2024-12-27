// pages/api/admin/points/[id].js
import prisma from '../../../../lib/prisma';
import { parseCookies } from 'nookies';

export default async function handler(req, res) {
  // Vérification de l'authentification admin
  const cookies = parseCookies({ req });
  const userCookie = cookies.user;

  if (!userCookie) {
    return res.status(401).json({ error: 'Non authentifié' });
  }

  const admin = JSON.parse(userCookie);
  if (admin.email !== 'info@repair-smartphone.fr') {
    return res.status(403).json({ error: 'Non autorisé' });
  }

  const { id } = req.query;

  if (req.method === 'POST') {
    try {
      const { points, reason } = req.body;
      
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          points: { increment: parseInt(points) },
          pointsHistory: {
            push: {
              points: parseInt(points),
              reason,
              date: new Date()
            }
          }
        }
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}