<template>
  <div class="space-y-4">
    <!-- Preview Container -->
    <div 
      v-if="images.length > 0" 
      class="border rounded-lg overflow-hidden bg-gray-100"
    >
      <div 
        v-for="(image, index) in images" 
        :key="index"
        class="mb-6 last:mb-0"
      >
        <div class="flex justify-between items-center mb-2">
          <span class="font-medium">{{ image.file?.name || t('preview.image') }}</span>
          <span class="text-sm text-gray-500">{{ formatFileSize(image.file?.size) }}</span>
        </div>
        
        <!-- Canvas Preview -->
        <div class="relative bg-gray-200 rounded overflow-hidden" style="height: 300px;">
          <canvas 
            ref="canvasRef" 
            class="w-full h-full object-contain"
            :width="canvasWidth"
            :height="canvasHeight"
          />
          
          <!-- Loading Overlay -->
          <div 
            v-if="isProcessing" 
            class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <div class="text-white flex flex-col items-center">
              <Icon name="heroicons:arrow-path" class="w-8 h-8 animate-spin mb-2" />
              <span>{{ t('preview.processing') }}</span>
            </div>
          </div>
        </div>
        
        <!-- Image Info -->
        <div class="mt-2 text-sm text-gray-600">
          <div>{{ t('preview.dimensions') }}: {{ imageDimensions.width }} × {{ imageDimensions.height }}</div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 text-gray-500">
      <Icon name="heroicons:photo" class="w-12 h-12 mx-auto mb-2" />
      <p>{{ t('preview.empty') }}</p>
      <p class="text-sm mt-1">{{ t('preview.upload') }}</p>
    </div>

    <!-- Zoom Controls -->
    <div v-if="images.length > 0" class="flex justify-center space-x-2">
      <UButton 
        color="secondary" 
        variant="outline" 
        size="sm"
        @click="zoomIn"
      >
        {{ t('preview.zoomIn') }}
      </UButton>
      <UButton 
        color="secondary" 
        variant="outline" 
        size="sm"
        @click="zoomOut"
      >
        {{ t('preview.zoomOut') }}
      </UButton>
      <UButton 
        color="secondary" 
        variant="outline" 
        size="sm"
        @click="resetZoom"
      >
        {{ t('preview.reset') }}
      </UButton>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const canvasRef = ref(null)
const canvasWidth = ref(400)
const canvasHeight = ref(300)
const zoomLevel = ref(1)
const imageDimensions = ref({ width: 0, height: 0 })

const props = defineProps({
  images: {
    type: Array,
    required: true
  },
  watermarks: {
    type: Array,
    default: () => []
  },
  isProcessing: {
    type: Boolean,
    default: false
  }
})

// Format file size
const formatFileSize = (size) => {
  if (!size) return ''
  if (size < 1024) return size + ' bytes'
  else if (size < 1048576) return (size / 1024).toFixed(1) + ' KB'
  else return (size / 1048576).toFixed(1) + ' MB'
}

// Zoom controls
const zoomIn = () => {
  zoomLevel.value = Math.min(zoomLevel.value + 0.2, 3)
  updateCanvasSize()
}

const zoomOut = () => {
  zoomLevel.value = Math.max(zoomLevel.value - 0.2, 0.5)
  updateCanvasSize()
}

const resetZoom = () => {
  zoomLevel.value = 1
  updateCanvasSize()
}

const updateCanvasSize = () => {
  if (canvasRef.value) {
    canvasWidth.value = 400 * zoomLevel.value
    canvasHeight.value = 300 * zoomLevel.value
  }
}

// Watch for changes in images or watermarks
watch([() => props.images, () => props.watermarks], () => {
  // In a real implementation, this would redraw the canvas with watermarks
  console.log('Updating preview with images and watermarks')
}, { deep: true })

onMounted(() => {
  updateCanvasSize()
})
</script>