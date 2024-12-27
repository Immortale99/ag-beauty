import prisma from "../../../lib/prisma";
import { parseCookies } from 'nookies';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { points, reason, type = 'add' } = req.body;
    const cookies = parseCookies({ req });
    const userCookie = cookies.user;

    if (!userCookie) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const user = JSON.parse(userCookie);

    // Mettre à jour les points
    const updatedUser = await prisma.user.update({
      where: { email: user.email },
      data: {
        points: {
          [type === 'add' ? 'increment' : 'decrement']: points
        },
        pointsHistory: {
          push: {
            amount: type === 'add' ? points : -points,
            reason,
            date: new Date().toISOString()
          }
        }
      },
      select: {
        points: true,
        pointsHistory: true
      }
    });

    // Envoyer les points mis à jour
    res.status(200).json({
      points: updatedUser.points,
      history: updatedUser.pointsHistory,
      message: `Points ${type === 'add' ? 'ajoutés' : 'retirés'} avec succès`
    });

  } catch (error) {
    console.error('Points update error:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour des points' });
  }
}