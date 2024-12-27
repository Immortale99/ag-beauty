// pages/api/blog/categories.js
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
      const categories = await prisma.category.findMany({
        orderBy: {
          name: 'asc'
        }
      });
      return res.status(200).json({ categories });
    } catch (error) {
      console.error('Error fetching categories:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name } = req.body;

      const exists = await prisma.category.findFirst({
        where: {
          name: {
            equals: name,
            mode: 'insensitive' // Vérifie sans tenir compte de la casse
          }
        }
      });

      if (exists) {
        return res.status(400).json({ error: 'Cette catégorie existe déjà' });
      }

      const category = await prisma.category.create({
        data: { name }
      });

      return res.status(201).json({ category });
    } catch (error) {
      console.error('Error creating category:', error);
      return res.status(500).json({ error: 'Erreur création' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}