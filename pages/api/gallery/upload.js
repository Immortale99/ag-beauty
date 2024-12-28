import formidable from 'formidable';
import prisma from '../../../lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const config = {
  api: {
    bodyParser: false,
  },
};

// pages/api/gallery/upload.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Starting upload process...');
    
    const form = formidable({
      keepExtensions: true,
    });

    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Form parsing error:', err);
          return resolve(res.status(500).json({ error: 'Error parsing form' }));
        }

        try {
          console.log('Files received:', files);
          const file = files.image[0];
          if (!file) {
            return resolve(res.status(400).json({ error: 'No image uploaded' }));
          }

          // Upload to Cloudinary
          console.log('Uploading to Cloudinary...');
          const result = await cloudinary.uploader.upload(file.filepath, {
            folder: 'gallery',
          });
          console.log('Cloudinary upload result:', result);

          // Save to database
          console.log('Saving to database...');
          const image = await prisma.galleryImage.create({
            data: {
              url: result.secure_url,
              category: fields.category?.[0] || 'Nail Art',
              price: parseFloat(fields.price?.[0] || '0'),
              description: fields.description?.[0] || ''
            }
          });
          console.log('Database save completed');

          return resolve(res.status(200).json({ image }));
        } catch (error) {
          console.error('Upload error:', error);
          return resolve(res.status(500).json({ 
            error: error.message,
            stack: error.stack 
          }));
        }
      });
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: error.message,
      stack: error.stack 
    });
  }
}