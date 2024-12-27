import prisma from "../../../lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await prisma.user.update({
      where: { email: 'salvatore.vaiana@hotmail.fr' },
      data: { password: hashedPassword }
    });

    res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur de réinitialisation' });
  }
}