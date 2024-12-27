// pages/api/reviews/index.js
import prisma from '../../../lib/prisma';
import { parseCookies } from 'nookies';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const reviews = await prisma.review.findMany({
        include: {
          user: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      return res.status(200).json({ reviews });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  if (req.method === 'POST') {
    const cookies = parseCookies({ req });
    const userCookie = cookies.user;

    if (!userCookie) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const user = JSON.parse(userCookie);
    const { rating, comment } = req.body;

    try {
      const review = await prisma.review.create({
        data: {
          userId: user.id,
          rating,
          comment
        },
        include: {
          user: true
        }
      });

      return res.status(201).json(review);
    } catch (error) {
      console.error('Error creating review:', error);
      return res.status(500).json({ error: 'Erreur lors de la création' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}