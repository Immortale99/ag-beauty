// pages/api/rewards/templates.js
import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const templates = await prisma.rewardTemplate.findMany({
      where: { isActive: true },
      orderBy: { pointsRequired: 'asc' }
    });

    res.status(200).json(templates);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: error.message });
  }
}