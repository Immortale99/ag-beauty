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
        where: { id: String(id) }  // Assurez-vous que l'ID est en string
      });

      if (!image) {
        return res.status(404).json({ error: 'Image non trouvée' });
      }

      // 2. Extraire l'ID Cloudinary de l'URL
      const cloudinaryPublicId = image.url
        .split('/')
        .slice(-2)
        .join('/')
        .split('.')[0];

      try {
        // 3. Supprimer l'image de Cloudinary
        await cloudinary.uploader.destroy(cloudinaryPublicId);
      } catch (cloudinaryError) {
        console.error('Erreur Cloudinary:', cloudinaryError);
        // Continue même si l'image n'existe pas sur Cloudinary
      }

      // 4. Supprimer l'entrée de la base de données
      await prisma.galleryImage.delete({
        where: { id: String(id) }
      });

      res.status(200).json({ message: 'Image supprimée avec succès' });
    } catch (error) {
      console.error('Erreur de suppression:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la suppression', 
        details: error.message 
      });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}