/**
 * PDF Processor - Handle PDF rendering and export in browser
 * Uses pdf.js for rendering and jsPDF for export
 */

import * as pdfjsLib from 'pdfjs-dist'
import { jsPDF } from 'jspdf'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

// Let Vite own the asset URL so dev-server and production both resolve correctly.
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

/**
 * Render PDF page to canvas
 * @param {File|Blob|ArrayBuffer|String} pdfSource - PDF file source
 * @param {Number} pageNum - Page number (1-based)
 * @param {Number} scale - Render scale (default 1.5 for quality)
 * @returns {Promise<{canvas: HTMLCanvasElement, width: Number, height: Number}>}
 */
export async function renderPdfPageToCanvas(pdfSource, pageNum = 1, scale = 1.5) {
  try {
    let pdfData
    
    // Handle different input types
    if (typeof pdfSource === 'string' && pdfSource.startsWith('data:')) {
      // Base64 data URL
      const base64Data = pdfSource.split(',')[1]
      const binaryString = atob(base64Data)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      pdfData = bytes.buffer
    } else if (pdfSource instanceof ArrayBuffer) {
      pdfData = pdfSource
    } else if (pdfSource instanceof File || pdfSource instanceof Blob) {
      pdfData = await pdfSource.arrayBuffer()
    } else {
      throw new Error('Unsupported PDF source type')
    }

    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({ data: pdfData })
    const pdf = await loadingTask.promise
    
    if (pageNum < 1 || pageNum > pdf.numPages) {
      throw new Error(`Invalid page number: ${pageNum}. PDF has ${pdf.numPages} pages.`)
    }

    // Get page
    const page = await pdf.getPage(pageNum)
    const viewport = page.getViewport({ scale })

    // Create canvas
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    const context = canvas.getContext('2d')

    // Render page to canvas
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise

    return {
      canvas,
      width: viewport.width,
      height: viewport.height,
      totalPages: pdf.numPages
    }
  } catch (error) {
    console.error('Error rendering PDF page:', error)
    throw error
  }
}

/**
 * Get PDF page count
 * @param {File|Blob|ArrayBuffer|String} pdfSource
 * @returns {Promise<Number>}
 */
export async function getPdfPageCount(pdfSource) {
  try {
    let pdfData
    
    if (typeof pdfSource === 'string' && pdfSource.startsWith('data:')) {
      const base64Data = pdfSource.split(',')[1]
      const binaryString = atob(base64Data)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      pdfData = bytes.buffer
    } else if (pdfSource instanceof ArrayBuffer) {
      pdfData = pdfSource
    } else if (pdfSource instanceof File || pdfSource instanceof Blob) {
      pdfData = await pdfSource.arrayBuffer()
    } else {
      throw new Error('Unsupported PDF source type')
    }

    const loadingTask = pdfjsLib.getDocument({ data: pdfData })
    const pdf = await loadingTask.promise
    return pdf.numPages
  } catch (error) {
    console.error('Error getting PDF page count:', error)
    return 0
  }
}

/**
 * Render all PDF pages to canvases
 * @param {File|Blob|ArrayBuffer|String} pdfSource
 * @param {Number} scale
 * @returns {Promise<Array<{canvas: HTMLCanvasElement, pageNum: Number, width: Number, height: Number}>>}
 */
export async function renderAllPdfPages(pdfSource, scale = 1.5) {
  const pages = []
  const pageCount = await getPdfPageCount(pdfSource)
  
  for (let i = 1; i <= pageCount; i++) {
    const result = await renderPdfPageToCanvas(pdfSource, i, scale)
    pages.push({
      canvas: result.canvas,
      pageNum: i,
      width: result.width,
      height: result.height
    })
  }
  
  return pages
}

/**
 * Export watermarked canvases as PDF
 * @param {Array<{canvas: HTMLCanvasElement, name?: String}>} canvases - Array of canvases
 * @param {String} filename - Output filename
 * @returns {Promise<Blob>}
 */
export async function exportCanvasesToPdf(canvases, filename = 'watermarked.pdf') {
  if (!canvases || canvases.length === 0) {
    throw new Error('No canvases provided')
  }

  try {
    // Create PDF with first canvas dimensions as default
    const firstCanvas = canvases[0].canvas
    const orientation = firstCanvas.width > firstCanvas.height ? 'landscape' : 'portrait'
    
    // Convert pixels to mm (assuming 96 DPI)
    const mmWidth = (firstCanvas.width / 96) * 25.4
    const mmHeight = (firstCanvas.height / 96) * 25.4
    
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: [mmWidth, mmHeight],
      compress: true
    })

    // Add each canvas as a page
    for (let i = 0; i < canvases.length; i++) {
      const { canvas } = canvases[i]
      
      if (i > 0) {
        // Add new page with same dimensions
        const pageWidth = (canvas.width / 96) * 25.4
        const pageHeight = (canvas.height / 96) * 25.4
        const pageOrientation = canvas.width > canvas.height ? 'landscape' : 'portrait'
        
        pdf.addPage([pageWidth, pageHeight], pageOrientation)
      }

      // Convert canvas to image
      const imgData = canvas.toDataURL('image/jpeg', 0.95)
      
      // Add image to PDF page
      const pageWidth = (canvas.width / 96) * 25.4
      const pageHeight = (canvas.height / 96) * 25.4
      pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight)
    }

    // Return as blob
    return pdf.output('blob')
  } catch (error) {
    console.error('Error exporting to PDF:', error)
    throw error
  }
}

/**
 * Check if file is PDF
 * @param {File} file
 * @returns {Boolean}
 */
export function isPdfFile(file) {
  return file?.type === 'application/pdf' || 
         file?.name?.toLowerCase().endsWith('.pdf')
}

/**
 * Download blob as file
 * @param {Blob} blob
 * @param {String} filename
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
