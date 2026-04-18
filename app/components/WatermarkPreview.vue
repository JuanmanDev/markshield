<template>
  <div 
    ref="previewContainer"
    class="relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none"
    @wheel.prevent="handleWheel"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseUp"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <!-- Preview Container -->
    <template v-if="images.length > 0">
      <div
        class="relative w-full h-full"
        style="cursor: grab;"
        :style="{ cursor: isDragging ? 'grabbing' : 'grab' }"
      >
        <!-- Image wrapper with transform -->
        <div
          class="absolute inset-0 flex items-center justify-center"
          :style="{
            transform: `translate(${panX}px, ${panY}px) scale(${zoomLevel})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }"
        >
          <!-- Show current image -->
          <div
            v-if="images[currentImageIndex]"
            class="relative shadow-[0_40px_100px_rgba(0,0,0,0.6)] rounded-lg overflow-hidden border border-white/5 bg-[#091328]"
          >
            <!-- Canvas Preview -->
            <canvas
              ref="mainCanvas"
              class="block"
              style="display: block; max-width: 90vw; max-height: 80vh; width: auto; height: auto;"
            />

            <!-- Loading Overlay -->
            <div
              v-if="isProcessing"
              class="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-500"
            >
              <div class="flex flex-col items-center gap-3">
                <div class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span class="text-[10px] font-bold text-on-surface tracking-widest uppercase">{{ t('preview.processing') }}</span>
              </div>
            </div>

            <!-- Image Info Tag -->
            <div class="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 pointer-events-none">
              <span class="text-[10px] font-bold text-on-surface tracking-tighter opacity-80">
                {{ images[currentImageIndex].file?.name }}
                <span v-if="images.length > 1" class="text-primary ml-1">{{ currentImageIndex + 1 }} / {{ images.length }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center h-full text-white/20 pointer-events-none cursor-pointer" @click="triggerUpload">
      <div class="w-24 h-24 rounded-3xl bg-surface-container flex items-center justify-center mb-6 shadow-inner">
        <span class="material-symbols-outlined text-5xl opacity-30">add_photo_alternate</span>
      </div>
      <p class="text-xs font-black tracking-widest uppercase opacity-40">{{ t('preview.empty') }}</p>
      <p class="text-[10px] mt-2 tracking-widest uppercase opacity-20">{{ t('preview.upload') }}</p>
    </div>

    <!-- Floating Action Buttons -->
    <div v-if="images.length > 0" class="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 bg-[#192540]/80 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl z-20 pointer-events-auto">
      <button class="p-2.5 hover:bg-white/10 rounded-xl transition-all text-on-surface/80 hover:text-on-surface pointer-events-auto" :title="t('preview.zoomOut')" @click.stop="zoomOut">
        <span class="material-symbols-outlined text-xl">zoom_out</span>
      </button>
      <div class="px-2 text-[10px] font-black tracking-tighter text-outline min-w-[3rem] text-center pointer-events-none">
        {{ Math.round(zoomLevel * 100) }}%
      </div>
      <button class="p-2.5 hover:bg-white/10 rounded-xl transition-all text-on-surface/80 hover:text-on-surface pointer-events-auto" :title="t('preview.zoomIn')" @click.stop="zoomIn">
        <span class="material-symbols-outlined text-xl">zoom_in</span>
      </button>
      <div class="w-px h-6 bg-white/5 mx-1"></div>
      <button class="p-2.5 hover:bg-white/10 rounded-xl transition-all text-on-surface hover:text-primary pointer-events-auto" :title="'Fit to view'" @click.stop="zoomFit">
        <span class="material-symbols-outlined text-xl">fit_screen</span>
      </button>
      <button class="p-2.5 hover:bg-white/10 rounded-xl transition-all text-on-surface/80 hover:text-on-surface pointer-events-auto" :title="t('preview.reset')" @click.stop="resetView">
        <span class="material-symbols-outlined text-xl">center_focus_strong</span>
      </button>
    </div>

    <!-- Help Text -->
    <div v-if="images.length > 0" class="absolute bottom-20 left-1/2 -translate-x-1/2 text-[9px] text-on-surface-variant/40 pointer-events-none">
      Scroll to zoom • Drag to pan
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'

const { t } = useI18n()
const previewContainer = ref(null)
const mainCanvas = ref(null)
const zoomLevel = ref(1)
const panX = ref(0)
const panY = ref(0)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartY = ref(0)
const panStartX = ref(0)
const panStartY = ref(0)

// Touch handling
const lastTouchDistance = ref(0)

const props = defineProps({
  images: {
    type: Array,
    required: true
  },
  watermarks: {
    type: Array,
    default: () => []
  },
  currentWatermark: {
    type: Object,
    default: () => ({})
  },
  isProcessing: {
    type: Boolean,
    default: false
  },
  currentImageIndex: {
    type: Number,
    default: 0
  },
  pdfPage: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['trigger-upload'])

const triggerUpload = () => {
  emit('trigger-upload')
}

// Mouse wheel zoom
const handleWheel = (e) => {
  const delta = e.deltaY > 0 ? -0.1 : 0.1
  const newZoom = Math.max(0.1, Math.min(5, zoomLevel.value + delta))
  
  // Zoom towards mouse position
  const rect = previewContainer.value.getBoundingClientRect()
  const mouseX = e.clientX - rect.left - rect.width / 2
  const mouseY = e.clientY - rect.top - rect.height / 2
  
  const zoomRatio = newZoom / zoomLevel.value
  panX.value = mouseX - (mouseX - panX.value) * zoomRatio
  panY.value = mouseY - (mouseY - panY.value) * zoomRatio
  
  zoomLevel.value = newZoom
}

// Mouse drag pan
const handleMouseDown = (e) => {
  if (e.button === 0) {
    isDragging.value = true
    dragStartX.value = e.clientX
    dragStartY.value = e.clientY
    panStartX.value = panX.value
    panStartY.value = panY.value
  }
}

const handleMouseMove = (e) => {
  if (isDragging.value) {
    panX.value = panStartX.value + (e.clientX - dragStartX.value)
    panY.value = panStartY.value + (e.clientY - dragStartY.value)
  }
}

const handleMouseUp = () => {
  isDragging.value = false
}

// Touch handling
const handleTouchStart = (e) => {
  if (e.touches.length === 1) {
    // Single touch - drag
    isDragging.value = true
    dragStartX.value = e.touches[0].clientX
    dragStartY.value = e.touches[0].clientY
    panStartX.value = panX.value
    panStartY.value = panY.value
  } else if (e.touches.length === 2) {
    // Two fingers - pinch zoom
    isDragging.value = false
    const dx = e.touches[0].clientX - e.touches[1].clientX
    const dy = e.touches[0].clientY - e.touches[1].clientY
    lastTouchDistance.value = Math.sqrt(dx * dx + dy * dy)
  }
}

const handleTouchMove = (e) => {
  if (e.touches.length === 1 && isDragging.value) {
    // Drag
    panX.value = panStartX.value + (e.touches[0].clientX - dragStartX.value)
    panY.value = panStartY.value + (e.touches[0].clientY - dragStartY.value)
  } else if (e.touches.length === 2) {
    // Pinch zoom
    const dx = e.touches[0].clientX - e.touches[1].clientX
    const dy = e.touches[0].clientY - e.touches[1].clientY
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    const scale = distance / lastTouchDistance.value
    const newZoom = Math.max(0.1, Math.min(5, zoomLevel.value * scale))
    
    // Zoom towards center of pinch
    const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2
    const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2
    const rect = previewContainer.value.getBoundingClientRect()
    const mouseX = centerX - rect.left - rect.width / 2
    const mouseY = centerY - rect.top - rect.height / 2
    
    const zoomRatio = newZoom / zoomLevel.value
    panX.value = mouseX - (mouseX - panX.value) * zoomRatio
    panY.value = mouseY - (mouseY - panY.value) * zoomRatio
    
    zoomLevel.value = newZoom
    lastTouchDistance.value = distance
  }
}

const handleTouchEnd = () => {
  isDragging.value = false
  lastTouchDistance.value = 0
}

// Zoom controls
const zoomIn = () => zoomLevel.value = Math.min(zoomLevel.value + 0.2, 5)
const zoomOut = () => zoomLevel.value = Math.max(zoomLevel.value - 0.2, 0.1)
const resetView = () => {
  zoomLevel.value = 1
  panX.value = 0
  panY.value = 0
}

const zoomFit = () => {
  if (mainCanvas.value) {
    const canvas = mainCanvas.value
    const container = previewContainer.value
    
    if (container && canvas.width > 0) {
      const containerWidth = container.clientWidth * 0.9
      const containerHeight = container.clientHeight * 0.8
      
      const scaleX = containerWidth / canvas.width
      const scaleY = containerHeight / canvas.height
      zoomLevel.value = Math.min(scaleX, scaleY, 1)
      panX.value = 0
      panY.value = 0
    }
  } else {
    resetView()
  }
}

const imagesData = ref([])
const pdfPageCache = new Map()

// Helper to generate random color
const getRandomColor = (min, max) => {
  const minRgb = hexToRgb(min)
  const maxRgb = hexToRgb(max)

  const r = Math.floor(minRgb.r + Math.random() * (maxRgb.r - minRgb.r))
  const g = Math.floor(minRgb.g + Math.random() * (maxRgb.g - minRgb.g))
  const b = Math.floor(minRgb.b + Math.random() * (maxRgb.b - minRgb.b))

  return `rgb(${r}, ${g}, ${b})`
}

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 255, g: 255, b: 255 }
}

// Draw watermarks on canvas
const drawPreview = async () => {
  const canvas = mainCanvas.value
  const image = props.images[props.currentImageIndex]
  if (!canvas || !image) return

  const ctx = canvas.getContext('2d')

  // Handle PDF — render real page via pdfjs
  if (image.type === 'application/pdf') {
    const cacheKey = `${image.file?.name}_${props.pdfPage}`
    let pdfRender = pdfPageCache.get(cacheKey)

    if (!pdfRender) {
      try {
        const { renderPdfPageToCanvas } = await import('../utils/pdfProcessor')
        pdfRender = await renderPdfPageToCanvas(image.file, props.pdfPage || 1, 1.5)
        pdfPageCache.set(cacheKey, pdfRender)
      } catch {
        // Fallback placeholder on error
        canvas.width = 800
        canvas.height = 1132
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#667eea'
        ctx.font = 'bold 32px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('PDF — preview unavailable', canvas.width / 2, canvas.height / 2)
        return
      }
    }

    canvas.width = pdfRender.width
    canvas.height = pdfRender.height
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(pdfRender.canvas, 0, 0)

    // Overlay watermarks
    const allWatermarks = [...props.watermarks, props.currentWatermark]
    for (const wm of allWatermarks) {
      if (!wm.text) continue
      drawWatermark(ctx, wm, canvas)
    }
    return
  }

  // Regular image — load and cache
  let img = imagesData.value[props.currentImageIndex]
  if (!img || img.src !== image.preview) {
    img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = image.preview
    await new Promise(resolve => { img.onload = resolve })
    imagesData.value[props.currentImageIndex] = img
  }

  canvas.width = img.width
  canvas.height = img.height
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(img, 0, 0)

  const allWatermarks = [...props.watermarks, props.currentWatermark]
  for (const wm of allWatermarks) {
    if (!wm.text) continue
    drawWatermark(ctx, wm, canvas)
  }
}

// Helper to draw a single watermark with all features
const drawWatermark = (ctx, wm, canvas) => {
  ctx.save()

  const fontSize = (wm.fontSize || 32) * (canvas.width / 1000)
  ctx.font = `bold ${fontSize}px Inter, sans-serif`

  const x = (wm.x / 100) * canvas.width
  const y = (wm.y / 100) * canvas.height

  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'

  const lineHeight = fontSize * (wm.lineHeightMultiplier || 1.5)

  if (wm.pattern) {
    // Calculate spacing in pixels based on line height
    const spacingUnit = wm.patternSpacingUnit || 'lines'
    let stepX, stepY, offset

    if (spacingUnit === 'lines') {
      stepX = (wm.patternSpacingX || 3) * lineHeight
      stepY = (wm.patternSpacingY || 2.5) * lineHeight
      offset = (wm.patternOffset || 1.5) * lineHeight
    } else {
      stepX = wm.patternSpacingX || 150
      stepY = wm.patternSpacingY || 100
      offset = wm.patternOffset || 0
    }

    const useRandomOffset = wm.patternRandomOffset || false
    const patternRotation = ((wm.patternRotation || wm.rotation || 0)) * Math.PI / 180

    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate(patternRotation)
    ctx.translate(-canvas.width / 2, -canvas.height / 2)

    let row = 0
    for (let py = -stepY; py < canvas.height + stepY * 2; py += stepY) {
      const rowOffset = useRandomOffset ? (Math.random() - 0.5) * offset * 2 : (row % 2 === 0 ? 0 : offset)

      for (let px = -stepX + rowOffset; px < canvas.width + stepX * 2; px += stepX) {
        const adjustedX = px - canvas.width / 2
        const adjustedY = py - canvas.height / 2
        drawSingleWatermark(ctx, wm, adjustedX, adjustedY, fontSize, 0, canvas)
      }
      row++
    }

    ctx.restore()
  } else {
    const rotation = (wm.rotation || 0) * Math.PI / 180
    drawSingleWatermark(ctx, wm, x, y, fontSize, rotation, canvas)
  }

  ctx.restore()
}

const drawSingleWatermark = (ctx, wm, x, y, fontSize, rotation, canvas) => {
  ctx.save()

  ctx.translate(x, y)
  ctx.rotate(rotation)

  // Handle multi-line text
  const textLines = (wm.text || 'Watermark').split('\n')
  const lineHeight = fontSize * (wm.lineHeightMultiplier || 1.5)
  const totalHeight = textLines.length * lineHeight
  const startY = -totalHeight / 2 + lineHeight / 2

  // Measure text for background/border (use longest line)
  let maxTextWidth = 0
  textLines.forEach(line => {
    const metrics = ctx.measureText(line)
    if (metrics.width > maxTextWidth) maxTextWidth = metrics.width
  })

  const textWidth = maxTextWidth
  const textHeight = totalHeight
  const padding = wm.bgPadding || 10

  // Draw background if enabled
  if (wm.bgEnabled) {
    ctx.save()
    ctx.fillStyle = wm.bgColor || '#000000'
    ctx.globalAlpha = wm.bgOpacity || 0.5

    const bgX = -textWidth / 2 - padding
    const bgY = -textHeight / 2 - padding
    const bgWidth = textWidth + padding * 2
    const bgHeight = textHeight + padding * 2
    const radius = wm.bgRadius || 0

    drawRoundedRect(ctx, bgX, bgY, bgWidth, bgHeight, radius)
    ctx.fill()
    ctx.restore()
  }

  // Draw border if enabled
  if (wm.borderEnabled) {
    ctx.save()
    ctx.strokeStyle = wm.borderColor || '#ffffff'
    ctx.globalAlpha = wm.borderOpacity || 1
    ctx.lineWidth = wm.borderWidth || 2

    if (wm.borderStyle === 'dashed') {
      ctx.setLineDash([fontSize * 0.3, fontSize * 0.2])
    } else if (wm.borderStyle === 'dotted') {
      ctx.setLineDash([fontSize * 0.1, fontSize * 0.15])
    }

    const borderX = -textWidth / 2 - padding - wm.borderWidth
    const borderY = -textHeight / 2 - padding - wm.borderWidth
    const borderWidth = textWidth + (padding + wm.borderWidth) * 2
    const borderHeight = textHeight + (padding + wm.borderWidth) * 2
    const borderRadius = wm.borderRadius || 0

    drawRoundedRect(ctx, borderX, borderY, borderWidth, borderHeight, borderRadius)
    ctx.stroke()
    ctx.restore()
  }

  // Set text color based on color mode
  let textColor = wm.color || '#ffffff'
  let textOpacity = wm.opacity || 0.7

  if (wm.colorMode === 'gradient') {
    const angle = (wm.gradientAngle || 45) * Math.PI / 180
    const gradientLength = textWidth * 1.5
    const x1 = -Math.cos(angle) * gradientLength / 2
    const x2 = Math.cos(angle) * gradientLength / 2
    const y1 = -Math.sin(angle) * gradientLength / 2
    const y2 = Math.sin(angle) * gradientLength / 2

    const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
    gradient.addColorStop(0, wm.gradientStart || '#667eea')
    gradient.addColorStop(1, wm.gradientEnd || '#764ba2')
    textColor = gradient
  } else if (wm.colorMode === 'random') {
    textColor = getRandomColor(wm.randomColorMin || '#667eea', wm.randomColorMax || '#764ba2')
    textOpacity = wm.randomOpacityMin + Math.random() * (wm.randomOpacityMax - wm.randomOpacityMin)
  }

  // Draw multi-line text
  ctx.globalAlpha = textOpacity
  ctx.fillStyle = textColor
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'

  textLines.forEach((line, index) => {
    const lineY = startY + (index * lineHeight)
    ctx.fillText(line, 0, lineY)
  })

  ctx.restore()
}

const drawRoundedRect = (ctx, x, y, width, height, radius) => {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

const redrawAll = () => {
  nextTick(() => {
    drawPreview()
  })
}

// Watch for changes and redraw
watch(
  [() => props.images, () => props.watermarks, () => props.currentWatermark, () => props.currentImageIndex, () => props.pdfPage],
  (_, [oldImages]) => {
    if (props.images !== oldImages) {
      imagesData.value = []
      pdfPageCache.clear()
    }
    redrawAll()
  },
  { deep: true }
)

onMounted(() => {
  redrawAll()
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
