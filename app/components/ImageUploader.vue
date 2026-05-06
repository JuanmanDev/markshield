<template>
  <section class="h-56 bg-surface-container-low/30 backdrop-blur-md border-t border-white/5 flex flex-col">
    <!-- Drag and Drop Zone -->
    <div 
      class="px-8 py-3 flex items-center justify-between border-b border-white/5 cursor-pointer"
      @dragover.prevent="handleDragOver"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        multiple
        accept="image/*,.pdf"
        class="hidden"
        @change="handleFileSelect"
      >
      <div class="flex items-center gap-4 group">
        <div class="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary-dim group-hover:bg-primary group-hover:text-on-primary transition-all">
          <span class="material-symbols-outlined text-sm">cloud_upload</span>
        </div>
        <p class="text-xs font-medium text-on-surface-variant"><span class="text-on-surface font-bold">Drag files</span>, click to browse, or paste</p>
      </div>
      <p class="text-[10px] font-bold text-outline uppercase tracking-widest">Gallery — {{ previewImages.length }} Items</p>
    </div>
    
    <!-- Thumbnail Gallery -->
    <div class="flex-1 overflow-x-auto flex items-center gap-4 px-8 py-4 scroll-smooth">
      <div
        v-for="(image, index) in previewImages"
        :key="index"
        class="relative flex-shrink-0 w-32 h-20 rounded-lg overflow-hidden border border-white/5 group hover:border-white/20 transition-all cursor-pointer"
      >
        <!-- PDF Icon Overlay -->
        <div v-if="image.type === 'application/pdf'" class="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center">
          <span class="material-symbols-outlined text-3xl text-red-400">picture_as_pdf</span>
          <div v-if="image.pageCount" class="absolute bottom-1 left-1 bg-black/70 px-1.5 py-0.5 rounded text-[8px] font-bold text-white">
            {{ image.pageCount }}p
          </div>
        </div>
        <!-- Regular Image -->
        <img v-else :src="image.preview" class="w-full h-full object-cover transition-all" />
        <button
          @click.stop="removeImage(index)"
          class="absolute top-1 right-1 w-5 h-5 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white/60 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <span class="material-symbols-outlined text-[14px]">close</span>
        </button>
      </div>

      <!-- Add Button -->
      <button 
        @click="triggerFileInput"
        class="flex-shrink-0 w-32 h-20 rounded-lg border-2 border-dashed border-white/10 hover:border-primary/50 hover:bg-white/5 transition-all flex flex-col items-center justify-center gap-1 group"
      >
        <span class="material-symbols-outlined text-outline group-hover:text-primary">add_photo_alternate</span>
        <span class="text-[10px] font-bold text-outline group-hover:text-primary">UPLOAD</span>
      </button>
      
      <!-- Paste Button -->
      <button 
        @click="pasteFromClipboard"
        class="flex-shrink-0 w-32 h-20 rounded-lg border-2 border-dashed border-white/10 hover:border-primary/50 hover:bg-white/5 transition-all flex flex-col items-center justify-center gap-1 group"
      >
        <span class="material-symbols-outlined text-outline group-hover:text-primary">content_paste</span>
        <span class="text-[10px] font-bold text-outline group-hover:text-primary">PASTE</span>
      </button>
    </div>
  </section>
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
const processFiles = async (files) => {
  const validFiles = files.filter(file => file.type.startsWith('image/') || file.type === 'application/pdf')

  for (const file of validFiles) {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const newImage = {
        file: file,
        preview: e.target.result,
        type: file.type
      }
      
      // Get PDF page count if it's a PDF
      if (file.type === 'application/pdf') {
        try {
          const { getPdfPageCount } = await import('../utils/pdfProcessor')
          newImage.pageCount = await getPdfPageCount(file)
        } catch (err) {
          console.warn('Could not get PDF page count:', err)
          newImage.pageCount = 0
        }
      }
      
      previewImages.value.push(newImage)
      emit('images-uploaded', [...previewImages.value])
    }
    reader.readAsDataURL(file)
  }
}

// Remove an image from preview
const removeImage = (index) => {
  previewImages.value.splice(index, 1)
  emit('images-uploaded', [...previewImages.value])
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
          const newImage = {
            file: new File([blob], 'clipboard-image.png', { type: 'image/png' }),
            preview: e.target.result
          }
          previewImages.value.push(newImage)
          emit('images-uploaded', [...previewImages.value])
        }
        reader.readAsDataURL(blob)
      }
    }
  } catch (error) {
    console.error('Failed to read clipboard contents:', error)
  }
}

// Clear all images
const clearAll = () => {
  previewImages.value = []
  emit('images-uploaded', [])
}

// Expose methods for parent use
defineExpose({
  triggerFileInput,
  removeImage,
  clearAll,
  processFiles
})

const emit = defineEmits(['images-uploaded'])
</script>