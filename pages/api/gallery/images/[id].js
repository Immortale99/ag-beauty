// pages/api/gallery/images/[id].js
import { v2 as cloudinary } from 'cloudinary';
import prisma from '../../../../lib/prisma';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      // 1. Récupérer l'image depuis la base de données
      const image = await prisma.galleryImage.findUnique({
        where: { id: parseInt(id) }
      });

      if (!image) {
        return res.status(404).json({ error: 'Image non trouvée' });
      }

      // 2. Extraire l'ID Cloudinary de l'URL
      const cloudinaryId = image.url.split('/').pop().split('.')[0];

      // 3. Supprimer l'image de Cloudinary
      await cloudinary.uploader.destroy(`gallery/${cloudinaryId}`);

      // 4. Supprimer l'entrée de la base de données
      await prisma.galleryImage.delete({
        where: { id: parseInt(id) }
      });

      res.status(200).json({ message: 'Image supprimée avec succès' });
    } catch (error) {
      console.error('Erreur de suppression:', error);
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'image' });
    }
  } else if (req.method === 'PUT') {
    try {
      const image = await prisma.galleryImage.update({
        where: { id: parseInt(id) },
        data: {
          category: req.body.category,
          price: req.body.price ? parseFloat(req.body.price) : undefined,
          description: req.body.description
        }
      });
      
      res.status(200).json(image);
    } catch (error) {
      console.error('Erreur de mise à jour:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'image' });
    }
  } else {
    res.setHeader('Allow', ['DELETE', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}