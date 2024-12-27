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
        id: true,
        email: true,
        points: true
      }
    });

    if (!userData) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    return res.status(200).json({
      points: userData.points || 0,
      email: userData.email
    });

  } catch (error) {
    console.error('Profile API Error:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}