import prisma from '../../../lib/prisma';
import { parseCookies } from 'nookies';

export default async function handler(req, res) {
  try {
    const cookies = parseCookies({ req });
    const user = JSON.parse(cookies.user);

    const points = await prisma.user.update({
      where: { id: user.id },
      data: { points: { increment: 10 } }
    });

    res.status(200).json(points);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}