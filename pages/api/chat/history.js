import prisma from '../../../lib/prisma';
import { parseCookies } from 'nookies';

export default async function handler(req, res) {
  const cookies = parseCookies({ req });
  const userCookie = cookies.user;

  if (!userCookie) {
    return res.status(401).json({ error: 'Non authentifié' });
  }

  switch (req.method) {
    case 'GET':
      try {
        // Récupérer l'historique des messages
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

        return res.status(200).json(conversations);
      } catch (error) {
        console.error('Error fetching history:', error);
        return res.status(500).json({ error: 'Erreur serveur' });
      }

    case 'POST':
      try {
        const { content, senderId, recipientId } = req.body;

        // Trouver ou créer une conversation
        let conversation = await prisma.conversation.findFirst({
          where: {
            OR: [
              { user: senderId, admin: recipientId },
              { user: recipientId, admin: senderId }
            ]
          }
        });

        if (!conversation) {
          conversation = await prisma.conversation.create({
            data: {
              user: senderId,
              admin: recipientId
            }
          });
        }

        // Ajouter le message
        const message = await prisma.message.create({
          data: {
            content,
            sender: senderId,
            conversationId: conversation.id
          }
        });

        return res.status(201).json(message);
      } catch (error) {
        console.error('Error saving message:', error);
        return res.status(500).json({ error: 'Erreur serveur' });
      }

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}