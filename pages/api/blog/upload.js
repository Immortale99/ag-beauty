// pages/api/blog/upload.js
import formidable from 'formidable';
import path from 'path';
import fs from 'fs/promises';

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = async (req) => {
  return new Promise((resolve, reject) => {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'blog');
    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Créer le dossier s'il n'existe pas
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'blog');
    await fs.mkdir(uploadDir, { recursive: true });

    // Parser le formulaire
    const { files } = await parseForm(req);
    const file = files.image?.[0];

    if (!file) {
      return res.status(400).json({ error: 'Aucune image fournie' });
    }

    // Générer un nom de fichier unique
    const uniqueFilename = `${Date.now()}-${file.originalFilename}`;
    const finalPath = path.join(uploadDir, uniqueFilename);

    // Déplacer le fichier
    await fs.rename(file.filepath, finalPath);

    // Retourner l'URL
    return res.status(200).json({
      url: `/uploads/blog/${uniqueFilename}`
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Erreur lors de l\'upload' });
  }
}