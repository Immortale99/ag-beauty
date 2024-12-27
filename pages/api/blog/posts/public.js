// pages/api/blog/posts/public.js
import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const posts = await prisma.blogPost.findMany({
        where: {
          published: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          categories: true
        }
      });

      // Ajout de logs pour déboguer
      console.log('Nombre de posts trouvés:', posts.length);
      
      return res.status(200).json({ posts });
    } catch (error) {
      console.error('Error fetching posts:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}