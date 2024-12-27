import prisma from "../../../lib/prisma";
import webPush from 'web-push';

const REWARD_THRESHOLDS = [
  { points: 50, name: 'Nail Art gratuit' },
  { points: 100, name: 'Réduction 10%' },
  { points: 200, name: 'Pose complète offerte' }
];

export default async function handler(req, res) {
  // Vérification de l'autorisation
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          pushSubscription: null
        }
      }
    });

    for (const user of users) {
      // Trouver le prochain seuil atteignable
      const nextThreshold = REWARD_THRESHOLDS.find(t => t.points > user.points);
      
      if (nextThreshold) {
        const pointsNeeded = nextThreshold.points - user.points;
        
        // Si l'utilisateur est à moins de 20 points du seuil
        if (pointsNeeded <= 20) {
          await webPush.sendNotification(
            JSON.parse(user.pushSubscription),
            JSON.stringify({
              title: "Récompense proche !",
              body: `Plus que ${pointsNeeded} points pour obtenir ${nextThreshold.name} !`,
              tag: 'reward-threshold',
              data: {
                type: 'threshold-notification',
                pointsNeeded,
                reward: nextThreshold.name
              }
            })
          );
        }
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erreur vérification seuils:', error);
    res.status(500).json({ error: error.message });
  }
}