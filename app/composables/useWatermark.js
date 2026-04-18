import { ref, reactive } from 'vue'

/**
 * Composable for managing watermark state and operations
 */
export function useWatermark() {
  // Reactive state for selected images
  const selectedImages = ref([])
  
  // Reactive state for watermarks
  const watermarks = ref([])
  
  // Current watermark configuration
  const currentWatermark = reactive({
    text: 'Watermark',
    fontSize: 32,
    color: '#ffffff',
    opacity: 0.7,
    x: 50,
    y: 50,
    pattern: false,
    // New properties
    rotation: 0,
    colorMode: 'solid',
    gradientStart: '#667eea',
    gradientEnd: '#764ba2',
    gradientAngle: 45,
    randomColorMin: '#667eea',
    randomColorMax: '#764ba2',
    randomOpacityMin: 0.3,
    randomOpacityMax: 0.8,
    bgEnabled: false,
    bgColor: '#000000',
    bgOpacity: 0.5,
    bgPadding: 10,
    bgRadius: 5,
    borderEnabled: false,
    borderColor: '#ffffff',
    borderWidth: 2,
    borderOpacity: 1,
    borderStyle: 'solid',
    borderRadius: 0,
    patternSpacingX: 150,
    patternSpacingY: 100,
    patternOffset: 0,
    patternRandomOffset: false
  })
  
  // Processing state
  const isProcessing = ref(false)
  
  // Add a new watermark
  const addWatermark = () => {
    watermarks.value.push({ ...currentWatermark })
  }
  
  // Update a watermark
  const updateWatermark = (index, updatedWatermark) => {
    if (index >= 0 && index < watermarks.value.length) {
      Object.assign(watermarks.value[index], updatedWatermark)
    }
  }
  
  // Remove a watermark
  const removeWatermark = (index) => {
    if (index >= 0 && index < watermarks.value.length) {
      watermarks.value.splice(index, 1)
    }
  }
  
  // Apply watermarks to images
  const applyWatermarks = async () => {
    if (!selectedImages.value.length || !watermarks.value.length) return
    
    isProcessing.value = true
    
    try {
      // In a real implementation, this would process the images
      // For now, we'll just simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Watermarks applied to images')
    } catch (error) {
      console.error('Error applying watermarks:', error)
    } finally {
      isProcessing.value = false
    }
  }
  
  // Download processed images
  const downloadImages = () => {
    console.log('Downloading images...')
    // In a real implementation, this would download the processed images
  }
  
  // Reset all settings
  const resetAll = () => {
    selectedImages.value = []
    watermarks.value = []
    Object.assign(currentWatermark, {
      text: 'Watermark',
      fontSize: 32,
      color: '#ffffff',
      opacity: 0.7,
      x: 50,
      y: 50,
      pattern: false,
      rotation: 0,
      colorMode: 'solid',
      gradientStart: '#667eea',
      gradientEnd: '#764ba2',
      gradientAngle: 45,
      randomColorMin: '#667eea',
      randomColorMax: '#764ba2',
      randomOpacityMin: 0.3,
      randomOpacityMax: 0.8,
      bgEnabled: false,
      bgColor: '#000000',
      bgOpacity: 0.5,
      bgPadding: 10,
      bgRadius: 5,
      borderEnabled: false,
      borderColor: '#ffffff',
      borderWidth: 2,
      borderOpacity: 1,
      borderStyle: 'solid',
      borderRadius: 0,
      patternSpacingX: 150,
      patternSpacingY: 100,
      patternOffset: 0,
      patternRandomOffset: false
    })
    isProcessing.value = false
  }
  
  // Update current watermark
  const updateCurrentWatermark = (newWatermark) => {
    Object.assign(currentWatermark, newWatermark)
  }
  
  // Update selected images
  const updateSelectedImages = (images) => {
    selectedImages.value = images
  }
  
  return {
    // State
    selectedImages,
    watermarks,
    currentWatermark,
    isProcessing,
    
    // Methods
    addWatermark,
    updateWatermark,
    removeWatermark,
    applyWatermarks,
    downloadImages,
    resetAll,
    updateCurrentWatermark,
    updateSelectedImages
  }
}