// pages/api/reviews/[id].js
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
  const { id } = req.query;

  // Vérification admin
  if (user.email !== 'info@repair-smartphone.fr') {
    return res.status(403).json({ error: 'Non autorisé' });
  }

  try {
    await prisma.review.delete({
      where: { id }
    });

    return res.status(200).json({ message: 'Avis supprimé' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}