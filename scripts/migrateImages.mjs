import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function updateImageUrls() {
  try {
    const images = await prisma.galleryImage.findMany({
      where: {
        url: {
          startsWith: '/uploads/'
        }
      }
    });

    console.log(`${images.length} images trouvées avec des URLs locales`);

    for (const image of images) {
      try {
        const defaultUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/v1/gallery/default_${image.id}.jpg`;
        
        await prisma.galleryImage.update({
          where: { id: image.id },
          data: { url: defaultUrl }
        });

        console.log(`✓ Image ${image.id} mise à jour avec URL Cloudinary : ${defaultUrl}`);
      } catch (err) {
        console.error(`Erreur pour l'image ${image.id}:`, err);
      }
    }

    console.log('Migration terminée !');
  } catch (error) {
    console.error('Erreur :', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateImageUrls().catch(console.error);