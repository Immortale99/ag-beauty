// pages/api/gallery/images/[id].js
import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      // Supprimer l'image de la base de données
      await prisma.galleryImage.delete({
        where: { id }
      });

      return res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
      console.error('Delete error:', error);
      return res.status(500).json({ error: 'Error deleting image' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}