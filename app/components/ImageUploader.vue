<template>
  <div class="space-y-4">
    <!-- File Upload -->
    <div 
      class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
      @dragover.prevent="handleDragOver"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <input 
        ref="fileInput"
        type="file" 
        multiple 
        accept="image/*" 
        class="hidden" 
        @change="handleFileSelect"
      >
      <div class="flex flex-col items-center">
        <Icon name="heroicons:upload" class="w-12 h-12 text-gray-400 mb-2" />
        <p class="text-gray-600">{{ t('upload.dragDrop') }}</p>
        <p class="text-sm text-gray-500 mt-1">{{ t('upload.or') }}</p>
        <UButton 
          color="primary" 
          variant="solid" 
          class="mt-2"
          size="sm"
        >
          {{ t('upload.select') }}
        </UButton>
      </div>
    </div>

    <!-- Image Preview -->
    <div v-if="previewImages.length > 0" class="mt-4">
      <h3 class="text-lg font-medium text-gray-800 mb-2">{{ t('upload.preview') }}</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        <div 
          v-for="(image, index) in previewImages" 
          :key="index"
          class="relative group"
        >
          <img 
            :src="image.preview" 
            :alt="t('upload.previewImage')" 
            class="w-full h-24 object-cover rounded border"
          >
          <button 
            @click="removeImage(index)"
            class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            :title="t('upload.remove')"
          >
            <Icon name="heroicons:x-mark" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Clipboard Paste -->
    <div class="mt-4">
      <UButton 
        color="secondary" 
        variant="outline" 
        @click="pasteFromClipboard"
        size="sm"
      >
        {{ t('upload.paste') }}
      </UButton>
      <p class="text-sm text-gray-500 mt-1">{{ t('upload.clipboardInfo') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const fileInput = ref(null)
const previewImages = ref([])

// Handle drag over event
const handleDragOver = (event) => {
  event.preventDefault()
}

// Handle drop event
const handleDrop = (event) => {
  event.preventDefault()
  const files = Array.from(event.dataTransfer.files)
  processFiles(files)
}

// Trigger file input
const triggerFileInput = () => {
  fileInput.value?.click()
}

// Handle file selection
const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  processFiles(files)
}

// Process selected files
const processFiles = (files) => {
  const imageFiles = files.filter(file => file.type.startsWith('image/'))
  
  imageFiles.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImages.value.push({
        file: file,
        preview: e.target.result
      })
    }
    reader.readAsDataURL(file)
  })
  
  // Emit uploaded images
  emit('images-uploaded', previewImages.value)
}

// Remove an image from preview
const removeImage = (index) => {
  previewImages.value.splice(index, 1)
}

// Paste from clipboard
const pasteFromClipboard = async () => {
  try {
    const clipboardItems = await navigator.clipboard.read()
    for (const clipboardItem of clipboardItems) {
      if (clipboardItem.types.includes('image/png') || clipboardItem.types.includes('image/jpeg')) {
        const blob = await clipboardItem.getType('image/png')
        const reader = new FileReader()
        reader.onload = (e) => {
          previewImages.value.push({
            file: new File([blob], 'clipboard-image.png', { type: 'image/png' }),
            preview: e.target.result
          })
        }
        reader.readAsDataURL(blob)
      }
    }
  } catch (error) {
    console.error('Failed to read clipboard contents:', error)
  }
}

const emit = defineEmits(['images-uploaded'])
</script>