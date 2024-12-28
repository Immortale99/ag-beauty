// pages/api/gallery/upload.js
import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';
import fs from 'fs';
import prisma from '../../../lib/prisma';

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = await new Promise((resolve, reject) => {
      const form = new formidable.IncomingForm();
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const file = data.files.image;
    const fileData = fs.readFileSync(file.filepath);

    const cloudinaryResponse = await cloudinary.uploader.upload(file.filepath, {
      folder: 'gallery'
    });

    const image = await prisma.galleryImage.create({
      data: {
        url: cloudinaryResponse.secure_url,
        category: data.fields.category || 'Nail Art',
        price: parseFloat(data.fields.price) || 0,
        description: data.fields.description || ''
      }
    });

    fs.unlinkSync(file.filepath);
    return res.status(200).json({ image });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: error.message });
  }
}