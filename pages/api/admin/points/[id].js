// pages/api/admin/points/[id].js
import prisma from '../../../../lib/prisma';
import { parseCookies } from 'nookies';

export default async function handler(req, res) {
  console.log('Route admin points appelée');

  // Vérification de l'authentification admin
  const cookies = parseCookies({ req });
  const userCookie = cookies.user;

  console.log('Vérification authentification...');

  if (!userCookie) {
    console.log('Pas de cookie utilisateur trouvé');
    return res.status(401).json({ error: 'Non authentifié' });
  }

  const admin = JSON.parse(userCookie);
  console.log('Admin email:', admin.email);

  if (admin.email !== 'info@repair-smartphone.fr') {
    console.log('Tentative d\'accès non autorisé');
    return res.status(403).json({ error: 'Non autorisé' });
  }

  const { id } = req.query;
  console.log('ID utilisateur cible:', id);

  if (req.method === 'POST') {
    try {
      console.log('Traitement de la requête POST');
      const { points, reason } = req.body;
      
      if (!points || !reason) {
        console.log('Données manquantes:', { points, reason });
        return res.status(400).json({ error: 'Points et raison requis' });
      }

      const pointsNumber = parseInt(points);
      if (isNaN(pointsNumber)) {
        console.log('Points invalides:', points);
        return res.status(400).json({ error: 'Points invalides' });
      }

      console.log('Mise à jour des points:', { points: pointsNumber, reason });
      
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          points: { increment: pointsNumber },
          pointsHistory: {
            push: {
              points: pointsNumber,
              reason,
              date: new Date().toISOString()
            }
          }
        },
        select: {
          id: true,
          email: true,
          points: true,
          pointsHistory: true
        }
      });

      console.log('Utilisateur mis à jour:', {
        id: updatedUser.id,
        points: updatedUser.points
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Erreur détaillée:', error);
      return res.status(500).json({ 
        error: 'Erreur serveur', 
        details: error.message 
      });
    }
  }

  console.log('Méthode non autorisée:', req.method);
  return res.status(405).json({ error: 'Method not allowed' });
}