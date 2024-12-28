// pages/api/gallery/upload.js
import { v2 as cloudinary } from 'cloudinary';
import formidable, { IncomingForm } from 'formidable';
import fs from 'fs';
import prisma from '../../../lib/prisma';

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
    const form = formidable({
      uploadDir: '/tmp',
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    const formData = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error("Formidable error:", err);
          reject(err);
          return;
        }
        resolve({ fields, files });
      });
    });

    const file = formData.files.image;
    if (!file || !file[0]) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const uploadResult = await cloudinary.uploader.upload(file[0].filepath, {
      folder: 'gallery',
      resource_type: 'auto',
    });

    const image = await prisma.galleryImage.create({
      data: {
        url: uploadResult.secure_url,
        category: formData.fields.category?.[0] || 'Nail Art',
        price: formData.fields.price?.[0] ? parseFloat(formData.fields.price[0]) : 0,
        description: formData.fields.description?.[0] || ''
      }
    });

    // Cleanup
    try {
      fs.unlinkSync(file[0].filepath);
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError);
    }

    return res.status(200).json({
      success: true,
      image
    });

  } catch (error) {
    console.error('Upload handler error:', error);
    return res.status(500).json({
      error: 'Upload failed',
      details: error.message
    });
  }
}