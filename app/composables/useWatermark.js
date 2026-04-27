import { ref, reactive } from 'vue'

export function useWatermark() {
  const selectedImages = ref([])
  const watermarks = ref([])

  const defaults = {
    text: 'Watermark',
    fontSize: 32,
    color: '#ffffff',
    opacity: 0.7,
    x: 50,
    y: 50,
    pattern: false,
    rotation: 0,
    // Text color
    colorMode: 'solid',
    gradientStart: '#667eea',
    gradientEnd: '#764ba2',
    gradientAngle: 45,
    randomColorMin: '#667eea',
    randomColorMax: '#764ba2',
    randomOpacityMin: 0.3,
    randomOpacityMax: 0.8,
    // Per-tile random ranges
    randomizeOpacity: false,
    opacityMin: 0.3,
    opacityMax: 0.8,
    randomizeSize: false,
    sizeMin: 16,
    sizeMax: 64,
    randomizeRotation: false,
    rotationMin: -30,
    rotationMax: 30,
    // Background
    bgEnabled: false,
    bgColorMode: 'solid',
    bgColor: '#000000',
    bgGradientStart: '#333333',
    bgGradientEnd: '#000000',
    bgGradientAngle: 0,
    bgRandomColorMin: '#000000',
    bgRandomColorMax: '#333333',
    bgOpacity: 0.5,
    bgPadding: 10,
    bgPaddingAuto: false,
    bgPaddingMult: 0.3,
    bgRadius: 5,
    bgRadiusAuto: false,
    bgRadiusMult: 0.15,
    // Border
    borderEnabled: false,
    borderColorMode: 'solid',
    borderColor: '#ffffff',
    borderGradientStart: '#ffffff',
    borderGradientEnd: '#cccccc',
    borderGradientAngle: 0,
    borderRandomColorMin: '#cccccc',
    borderRandomColorMax: '#ffffff',
    borderWidth: 2,
    borderOpacity: 1,
    borderStyle: 'solid',
    borderRadius: 0,
    // Pattern
    patternSpacingX: 3,
    patternSpacingY: 2.5,
    patternSpacingXUnit: 'lines',
    patternSpacingYUnit: 'lines',
    patternOffset: 1.5,
    patternGapY: 0,
    patternRandomOffset: false,
    patternRotation: 0,
    lineHeightMultiplier: 1.5,
    textCutout: false,
    // Text stroke/outline
    textStrokeEnabled: false,
    textStrokeColorMode: 'solid',
    textStrokeColor: '#000000',
    textStrokeGradientStart: '#000000',
    textStrokeGradientEnd: '#555555',
    textStrokeGradientAngle: 45,
    textStrokeRandomColorMin: '#000000',
    textStrokeRandomColorMax: '#555555',
    textStrokeWidth: 2,
    textStrokeOpacity: 1,
  }

  const currentWatermark = reactive({ ...defaults })

  const isProcessing = ref(false)

  const addWatermark = () => { watermarks.value.push({ ...currentWatermark }) }
  const updateWatermark = (index, updated) => {
    if (index >= 0 && index < watermarks.value.length)
      Object.assign(watermarks.value[index], updated)
  }
  const removeWatermark = (index) => {
    if (index >= 0 && index < watermarks.value.length)
      watermarks.value.splice(index, 1)
  }
  const applyWatermarks = async () => {
    if (!selectedImages.value.length || !watermarks.value.length) return
    isProcessing.value = true
    try { await new Promise(r => setTimeout(r, 1000)) }
    catch (e) { console.error(e) }
    finally { isProcessing.value = false }
  }
  const downloadImages = () => {}
  const resetAll = () => {
    selectedImages.value = []
    watermarks.value = []
    Object.assign(currentWatermark, defaults)
    isProcessing.value = false
  }
  const updateCurrentWatermark = (wm) => Object.assign(currentWatermark, wm)
  const updateSelectedImages = (images) => { selectedImages.value = images }

  return {
    selectedImages, watermarks, currentWatermark, isProcessing,
    addWatermark, updateWatermark, removeWatermark, applyWatermarks,
    downloadImages, resetAll, updateCurrentWatermark, updateSelectedImages,
  }
}
