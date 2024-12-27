import prisma from "../../../lib/prisma";
import { parseCookies } from 'nookies';

export default async function handler(req, res) {
  const cookies = parseCookies({ req });
  const userCookie = cookies.user;

  if (!userCookie) {
    return res.status(401).json({ error: 'Non authentifié' });
  }

  const user = JSON.parse(userCookie);

  switch (req.method) {
    case 'GET':
      try {
        const userData = await prisma.user.findUnique({
          where: { email: user.email },
          select: {
            points: true,
            pointsHistory: true,
            tier: true,
            earnedRewards: true
          }
        });

        return res.status(200).json({
          points: userData?.points || 0,
          history: userData?.pointsHistory || [],
          tier: userData?.tier || 'BRONZE',
          earnedRewards: userData?.earnedRewards || []
        });
      } catch (error) {
        return res.status(500).json({ error: 'Erreur serveur' });
      }

    case 'POST':
      try {
        const { points, reason } = req.body;
        
        const updatedUser = await prisma.user.update({
          where: { email: user.email },
          data: {
            points: { increment: points },
            pointsHistory: {
              push: {
                points,
                reason,
                date: new Date().toISOString()
              }
            }
          }
        });

        // Mise à jour du tier
        let newTier = 'BRONZE';
        if (updatedUser.points >= 500) newTier = 'PLATINUM';
        else if (updatedUser.points >= 250) newTier = 'GOLD';
        else if (updatedUser.points >= 100) newTier = 'SILVER';

        if (newTier !== updatedUser.tier) {
          await prisma.user.update({
            where: { email: user.email },
            data: { tier: newTier }
          });
        }

        return res.status(200).json({
          points: updatedUser.points,
          tier: newTier,
          message: 'Points mis à jour'
        });
      } catch (error) {
        return res.status(500).json({ error: 'Erreur mise à jour points' });
      }

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}