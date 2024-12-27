import sharp from 'sharp';

export async function optimizeImage(inputPath, outputPath, options = {}) {
  const {
    width = 1200,
    quality = 80,
    format = 'jpeg'
  } = options;

  try {
    await sharp(inputPath)
      .resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      [format]({
        quality,
        mozjpeg: true
      })
      .toFile(outputPath);

    return true;
  } catch (error) {
    console.error('Image optimization error:', error);
    return false;
  }
}