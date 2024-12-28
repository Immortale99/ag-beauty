// pages/api/gallery/images.js
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      console.log('Connecting to database...');
      console.log('Database URL:', process.env.DATABASE_URL.substring(0, 20) + '...'); // Ne pas logger l'URL complète

      const images = await prisma.galleryImage.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });

      console.log('Images fetched successfully:', images.length);
      return res.status(200).json({ images });
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: error.message });
    }
  }
}