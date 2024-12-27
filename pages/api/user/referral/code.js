import prisma from '../../../../lib/prisma';
import { parseCookies } from 'nookies';

export default async function handler(req, res) {
  // Vérifier l'authentification
  const cookies = parseCookies({ req });
  const userCookie = cookies.user;

  if (!userCookie) {
    return res.status(401).json({ error: 'Non authentifié' });
  }

  try {
    const user = JSON.parse(userCookie);
    console.log('User:', user); // Debug log

    // Chercher un code existant
    let referralCode = await prisma.referralCode.findFirst({
      where: { userId: user.id }
    });

    if (!referralCode) {
      // Générer un nouveau code si aucun n'existe
      const code = `AG${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      referralCode = await prisma.referralCode.create({
        data: {
          code,
          userId: user.id
        }
      });
    }

    return res.status(200).json({ referralCode });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}