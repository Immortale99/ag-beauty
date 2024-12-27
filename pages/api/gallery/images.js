// pages/api/gallery/images.js
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Récupérer toutes les images, triées par date de création
      const images = await prisma.galleryImage.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });

      return res.status(200).json({ images });
    } catch (error) {
      console.error('Error fetching images:', error);
      return res.status(500).json({ error: 'Error loading images' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}