import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  try {
    const services = await prisma.service.createMany({
      data: [
        {
          id: '1',
          name: 'Pose complète',
          price: 45,
          duration: 90,
          description: 'Pose complète avec gel'
        },
        {
          id: '2',
          name: 'Remplissage',
          price: 35,
          duration: 60,
          description: 'Remplissage gel'
        },
        {
          id: '3',
          name: 'Nail art',
          price: 15,
          duration: 30,
          description: 'Décoration sur ongles'
        }
      ],
      skipDuplicates: true
    });

    res.status(200).json({ success: true, services });
  } catch (error) {
    console.error('Error initializing services:', error);
    res.status(500).json({ error: error.message });
  }
}