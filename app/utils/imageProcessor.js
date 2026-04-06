/**
 * Image Processing Utilities for Watermarking Application
 * This file contains utility functions for handling image processing
 */

/**
 * Load an image from various sources
 * @param {string|File|Blob} source - Image source (URL, File, or Blob)
 * @returns {Promise<HTMLImageElement>} Promise that resolves to loaded image
 */
export async function loadImage(source) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(new Error(`Failed to load image: ${error}`));
    
    if (typeof source === 'string') {
      // Handle URL or data URL
      img.src = source;
    } else if (source instanceof File || source instanceof Blob) {
      // Handle File or Blob
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(source);
    } else {
      reject(new Error('Unsupported image source type'));
    }
  });
}

/**
 * Draw text watermark on canvas
 * @param {HTMLCanvasElement} canvas - Target canvas
 * @param {string} text - Text to draw
 * @param {Object} options - Watermark options
 * @param {number} options.fontSize - Font size in pixels
 * @param {string} options.color - Text color
 * @param {number} options.opacity - Text opacity (0-1)
 * @param {number} options.x - X position (0-100%)
 * @param {number} options.y - Y position (0-100%)
 */
export function drawTextWatermark(canvas, text, options) {
  const ctx = canvas.getContext('2d');
  
  // Set text properties
  ctx.font = `${options.fontSize}px Arial`;
  ctx.fillStyle = options.color;
  ctx.globalAlpha = options.opacity;
  
  // Calculate position
  const x = (canvas.width * options.x) / 100;
  const y = (canvas.height * options.y) / 100;
  
  // Draw text
  ctx.fillText(text, x, y);
}

/**
 * Apply multiple watermarks to an image
 * @param {HTMLImageElement} image - Source image
 * @param {Array} watermarks - Array of watermark configurations
 * @returns {Promise<HTMLCanvasElement>} Promise that resolves to canvas with watermarks
 */
export async function applyWatermarks(image, watermarks) {
  // Create canvas with same dimensions as image
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  
  const ctx = canvas.getContext('2d');
  
  // Draw original image
  ctx.drawImage(image, 0, 0);
  
  // Apply each watermark
  watermarks.forEach(watermark => {
    drawTextWatermark(canvas, watermark.text, watermark);
  });
  
  return canvas;
}

/**
 * Export canvas as image
 * @param {HTMLCanvasElement} canvas - Source canvas
 * @param {string} format - Export format ('png' or 'jpeg')
 * @param {number} quality - Quality for jpeg (0-1)
 * @returns {Promise<Blob>} Promise that resolves to image blob
 */
export function exportImage(canvas, format = 'png', quality = 0.92) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to export image'));
        }
      },
      `image/${format}`,
      quality
    );
  });
}

/**
 * Create a download link for an image
 * @param {Blob} blob - Image blob
 * @param {string} filename - Download filename
 */
export function downloadImage(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Handle clipboard image paste
 * @returns {Promise<Array>} Promise that resolves to array of image files
 */
export async function handleClipboardPaste() {
  try {
    const clipboardItems = await navigator.clipboard.read();
    const imageFiles = [];
    
    for (const clipboardItem of clipboardItems) {
      if (clipboardItem.types.includes('image/png') || 
          clipboardItem.types.includes('image/jpeg') ||
          clipboardItem.types.includes('image/gif')) {
        const blob = await clipboardItem.getType('image/png');
        const file = new File([blob], 'clipboard-image.png', { type: 'image/png' });
        imageFiles.push(file);
      }
    }
    
    return imageFiles;
  } catch (error) {
    console.error('Failed to read clipboard contents:', error);
    return [];
  }
}