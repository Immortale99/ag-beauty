// pages/api/user/referral/use.js
import prisma from '../../../../lib/prisma';
import { parseCookies } from 'nookies';

export default async function handler(req, res) {
  console.log('API appelée avec:', req.body); // Debug log

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Vérification de l'authentification
  const cookies = parseCookies({ req });
  const userCookie = cookies.user;

  if (!userCookie) {
    return res.status(401).json({ error: 'Non authentifié' });
  }

  try {
    const user = JSON.parse(userCookie);
    console.log('Utilisateur:', user); // Debug log

    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code requis' });
    }

    // Recherche du code
    const referralCode = await prisma.referralCode.findFirst({
      where: { code }
    });
    
    console.log('Code trouvé:', referralCode); // Debug log

    if (!referralCode) {
      return res.status(404).json({ error: 'Code invalide' });
    }

    // Mises à jour des points
    await prisma.$transaction([
      // Points pour le filleul
      prisma.user.update({
        where: { id: user.id },
        data: {
          points: { increment: 10 }
        }
      }),
      // Points pour le parrain
      prisma.user.update({
        where: { id: referralCode.userId },
        data: {
          points: { increment: 20 }
        }
      })
    ]);

    return res.status(200).json({ message: 'Code utilisé avec succès' });

  } catch (error) {
    console.error('Erreur détaillée:', error); // Log détaillé de l'erreur
    return res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
}