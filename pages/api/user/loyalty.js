import prisma from "../../../lib/prisma";
import { parseCookies } from 'nookies';

export default async function handler(req, res) {
  console.log('Route loyalty appelée, méthode:', req.method);
  const cookies = parseCookies({ req });
  const userCookie = cookies.user;

  console.log('Cookie utilisateur présent:', !!userCookie);

  if (!userCookie) {
    return res.status(401).json({ error: 'Non authentifié' });
  }

  const user = JSON.parse(userCookie);
  console.log('Email utilisateur:', user.email);

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
        console.log('Points actuels:', userData?.points);

        return res.status(200).json({
          points: userData?.points || 0,
          history: userData?.pointsHistory || [],
          tier: userData?.tier || 'BRONZE',
          earnedRewards: userData?.earnedRewards || []
        });
      } catch (error) {
        console.error('Erreur GET:', error);
        return res.status(500).json({ error: 'Erreur serveur' });
      }

    case 'POST':
      try {
        console.log('Ajout de points...');
        const { points, reason } = req.body;
        console.log('Points à ajouter:', points, 'Raison:', reason);
        
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
        console.log('Points mis à jour:', updatedUser.points);

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
        console.error('Erreur POST:', error);
        return res.status(500).json({ error: 'Erreur mise à jour points' });
      }

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}
