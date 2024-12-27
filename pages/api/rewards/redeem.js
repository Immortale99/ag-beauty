// pages/api/rewards/redeem.js
import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { templateId } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    const template = await prisma.rewardTemplate.findUnique({
      where: { id: templateId }
    });

    if (!template) {
      return res.status(404).json({ error: 'Récompense non trouvée' });
    }

    if (user.points < template.pointsRequired) {
      return res.status(400).json({ error: 'Points insuffisants' });
    }

    // Transaction pour s'assurer que tout est mis à jour correctement
    const [reward, updatedUser] = await prisma.$transaction([
      prisma.reward.create({
        data: {
          userId: user.id,
          templateId: template.id,
          points: -template.pointsRequired,
          type: 'USED',
          reason: 'REWARD_USED',
          status: 'active'
        }
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          points: {
            decrement: template.pointsRequired
          }
        }
      })
    ]);

    res.status(200).json({
      reward,
      userPoints: updatedUser.points
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: error.message });
  }
}
