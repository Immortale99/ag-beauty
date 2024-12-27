import prisma from "../../../lib/prisma";
import { parseCookies } from 'nookies';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const cookies = parseCookies({ req });
    const userCookie = cookies.user;

    if (!userCookie) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const user = JSON.parse(userCookie);

    const userData = await prisma.user.findUnique({
      where: { email: user.email },
      select: {
        points: true,
        pointsHistory: true
      }
    });

    if (!userData) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.status(200).json({
      points: userData.points,
      history: userData.pointsHistory
    });

  } catch (error) {
    console.error('Points history error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique' });
  }
}