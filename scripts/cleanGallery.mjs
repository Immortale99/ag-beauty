import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

async function cleanGallery() {
  try {
    console.log('Début du nettoyage de la galerie...');
    
    // Supprime les images avec des URLs par défaut
    const deletedImages = await prisma.galleryImage.deleteMany({
      where: {
        url: {
          contains: 'default_'
        }
      }
    });

    console.log(`✓ ${deletedImages.count} images ont été nettoyées`);
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanGallery().catch(console.error);