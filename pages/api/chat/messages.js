import prisma from '../../../lib/prisma';
import { parseCookies } from 'nookies';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Récupérer les conversations
    try {
      const conversations = await prisma.conversation.findMany({
        include: {
          messages: {
            orderBy: {
              timestamp: 'asc'
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      });

      return res.status(200).json({ conversations });
    } catch (error) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  if (req.method === 'POST') {
    // Sauvegarder un nouveau message
    try {
      const { content, sender, recipient } = req.body;

      let conversation = await prisma.conversation.findFirst({
        where: { user: recipient }
      });

      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: { user: recipient }
        });
      }

      const message = await prisma.message.create({
        data: {
          content,
          sender,
          conversationId: conversation.id
        }
      });

      return res.status(200).json(message);
    } catch (error) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}