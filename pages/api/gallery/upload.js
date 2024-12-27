// pages/api/gallery/upload.js
import formidable from 'formidable';
import prisma from '../../../lib/prisma';
import path from 'path';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const uploadDir = path.join(process.cwd(), 'public/uploads/gallery');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      filename: (name, ext, part) => {
        return `${Date.now()}-${part.originalFilename}`;
      }
    });

    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Parse error:', err);
          return resolve(res.status(500).json({ error: 'Error parsing form' }));
        }

        try {
          const file = files.image[0]; // Changement ici
          if (!file) {
            return resolve(res.status(400).json({ error: 'No image uploaded' }));
          }

          // Créer l'entrée dans la base de données
          const image = await prisma.galleryImage.create({
            data: {
              url: `/uploads/gallery/${file.newFilename}`,
              category: fields.category?.[0] || 'Nail Art',
              price: parseFloat(fields.price?.[0] || '0'),
              description: fields.description?.[0] || ''
            }
          });

          return resolve(res.status(200).json({ image }));
        } catch (error) {
          console.error('Database error:', error);
          return resolve(res.status(500).json({ 
            error: 'Error saving image', 
            details: error.message 
          }));
        }
      });
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Server error', 
      details: error.message 
    });
  }
}