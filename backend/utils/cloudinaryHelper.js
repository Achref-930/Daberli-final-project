const cloudinary = require('../config/cloudinary');

/**
 * Extract the Cloudinary public_id from a full URL.
 * e.g. "https://res.cloudinary.com/demo/image/upload/v123/daberli/avatars/abc123.jpg"
 *  → "daberli/avatars/abc123"
 */
function extractPublicId(url) {
  if (!url || !url.includes('cloudinary')) return null;
  try {
    // Match everything after /upload/ (skip optional version like v1234567890/)
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Delete a single Cloudinary resource by its full URL.
 * Silently ignores failures (already deleted, non-cloudinary URL, etc.)
 */
async function destroyByUrl(url) {
  const publicId = extractPublicId(url);
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (e) {
    console.warn(`Cloudinary destroy failed for ${publicId}:`, e.message);
  }
}

/**
 * Delete multiple Cloudinary resources by their URLs.
 */
async function destroyManyByUrls(urls) {
  await Promise.allSettled(urls.map((url) => destroyByUrl(url)));
}

module.exports = { extractPublicId, destroyByUrl, destroyManyByUrls };
