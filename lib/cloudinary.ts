import { v2 as cloudinary } from 'cloudinary';
import { logger } from '@/lib/logger';

// Configure Cloudinary
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
} else {
  logger.warn('Cloudinary not configured. Image uploads will not work.');
}

/**
 * Upload image to Cloudinary
 * @param file - File buffer or base64 string
 * @param folder - Cloudinary folder path (e.g., 'products')
 */
export async function uploadImage(
  file: Buffer | string,
  folder: string = 'products'
): Promise<{ url: string; publicId: string }> {
  if (!process.env.CLOUDINARY_URL) {
    throw new Error('Cloudinary is not configured');
  }

  try {
    const result = await cloudinary.uploader.upload(
      typeof file === 'string' ? file : `data:image/jpeg;base64,${file.toString('base64')}`,
      {
        folder: `baabuji/${folder}`,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        max_file_size: 5000000, // 5MB
        transformation: [
          { width: 1200, height: 1200, crop: 'limit', quality: 'auto:good' },
        ],
      }
    );

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    logger.error('Cloudinary upload failed', error, { folder });
    throw new Error('Failed to upload image');
  }
}

/**
 * Delete image from Cloudinary
 * @param publicId - Cloudinary public ID
 */
export async function deleteImage(publicId: string): Promise<void> {
  if (!process.env.CLOUDINARY_URL) {
    throw new Error('Cloudinary is not configured');
  }

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    logger.error('Cloudinary delete failed', error, { publicId });
    throw new Error('Failed to delete image');
  }
}

/**
 * Generate Cloudinary thumbnail URL
 * @param url - Original Cloudinary URL
 * @param width - Thumbnail width
 * @param height - Thumbnail height
 */
export function generateThumbnail(
  url: string,
  width: number = 300,
  height: number = 300
): string {
  if (!url.includes('cloudinary.com')) {
    return url; // Return as-is if not a Cloudinary URL
  }

  // Insert transformation into URL
  return url.replace('/upload/', `/upload/w_${width},h_${height},c_fill,q_auto/`);
}

export { cloudinary };
