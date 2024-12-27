// pages/api/blog/posts.js
import prisma from '../../../lib/prisma';
import { parseCookies } from 'nookies';

export default async function handler(req, res) {
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
      const posts = await prisma.blogPost.findMany({
        orderBy: { createdAt: 'desc' },
        include: { categories: true }
      });
      return res.status(200).json({ posts });
    } catch (error) {
      console.error('Error fetching posts:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, content, excerpt, image, published, categories } = req.body;
      
      // Création du slug à partir du titre
      const slug = title
        .toLowerCase()
        .replace(/[éèê]/g, 'e')
        .replace(/[àâ]/g, 'a')
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-');

      const post = await prisma.blogPost.create({
        data: {
          title,
          content,
          excerpt,
          image,
          published: published || false,
          slug,
          categories: {
            connect: categories?.map(cat => ({ id: cat.id })) || []
          }
        },
        include: {
          categories: true
        }
      });

      return res.status(201).json({ post });
    } catch (error) {
      console.error('Error creating post:', error);
      return res.status(500).json({ error: 'Erreur création' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}