// pages/api/blog/categories/[id].js
import prisma from '../../../../lib/prisma';
import { parseCookies } from 'nookies';

export default async function handler(req, res) {
  const { id } = req.query;

  // Vérification de l'authentification
  const cookies = parseCookies({ req });
  const userCookie = cookies.user;

  if (!userCookie) {
    return res.status(401).json({ error: 'Non authentifié' });
  }

  const user = JSON.parse(userCookie);
  
  // Vérification admin
  if (user.email !== 'info@repair-smartphone.fr') {
    return res.status(403).json({ error: 'Accès non autorisé' });
  }

  if (req.method === 'GET') {
    try {
      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          posts: true
        }
      });

      if (!category) {
        return res.status(404).json({ error: 'Catégorie non trouvée' });
      }

      return res.status(200).json({ category });
    } catch (error) {
      console.error('Error fetching category:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { name } = req.body;

      const exists = await prisma.category.findFirst({
        where: {
          AND: [
            { name: { equals: name, mode: 'insensitive' } },
            { id: { not: id } }
          ]
        }
      });

      if (exists) {
        return res.status(400).json({ error: 'Cette catégorie existe déjà' });
      }

      const category = await prisma.category.update({
        where: { id },
        data: { name }
      });

      return res.status(200).json({ category });
    } catch (error) {
      console.error('Error updating category:', error);
      return res.status(500).json({ error: 'Erreur mise à jour' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      // Vérifie si la catégorie est utilisée
      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          posts: true
        }
      });

      if (category?.posts.length > 0) {
        return res.status(400).json({
          error: 'Cette catégorie est utilisée par des articles et ne peut pas être supprimée'
        });
      }

      await prisma.category.delete({
        where: { id }
      });

      return res.status(200).json({ message: 'Catégorie supprimée' });
    } catch (error) {
      console.error('Error deleting category:', error);
      return res.status(500).json({ error: 'Erreur suppression' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}