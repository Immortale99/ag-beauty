// pages/api/blog/posts/[id].js
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
      const post = await prisma.blogPost.findUnique({
        where: { id },
        include: { categories: true }
      });

      if (!post) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }

      return res.status(200).json({ post });
    } catch (error) {
      console.error('Error fetching post:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { title, content, excerpt, image, published, categories } = req.body;

      // Mise à jour du slug si le titre change
      const slug = title
        .toLowerCase()
        .replace(/[éèê]/g, 'e')
        .replace(/[àâ]/g, 'a')
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-');

      const post = await prisma.blogPost.update({
        where: { id },
        data: {
          title,
          content,
          excerpt,
          image,
          published,
          slug,
          categories: {
            set: [], // Déconnecte toutes les catégories existantes
            connect: categories?.map(cat => ({ id: cat.id })) || [] // Connecte les nouvelles
          }
        },
        include: {
          categories: true
        }
      });

      return res.status(200).json({ post });
    } catch (error) {
      console.error('Error updating post:', error);
      return res.status(500).json({ error: 'Erreur mise à jour' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.blogPost.delete({
        where: { id }
      });
      return res.status(200).json({ message: 'Article supprimé' });
    } catch (error) {
      console.error('Error deleting post:', error);
      return res.status(500).json({ error: 'Erreur suppression' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}