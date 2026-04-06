<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <header class="mb-8 text-center">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{{ t('app.title') }}</h1>
        <p class="text-gray-600">{{ t('app.description') }}</p>
      </header>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Panel - Upload and Configuration -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Image Upload -->
          <UCard>
            <template #header>
              <h2 class="text-xl font-semibold">{{ t('upload.title') }}</h2>
            </template>
            <ImageUploader @images-uploaded="updateSelectedImages" />
          </UCard>

          <!-- Watermark Configuration -->
          <UCard>
            <template #header>
              <h2 class="text-xl font-semibold">{{ t('watermark.title') }}</h2>
            </template>
            <WatermarkConfig
              :watermark="currentWatermark"
              @update:watermark="updateCurrentWatermark"
            />
          </UCard>

          <!-- Watermark Manager -->
          <UCard>
            <template #header>
              <h2 class="text-xl font-semibold">{{ t('manager.title') }}</h2>
            </template>
            <WatermarkManager
              :watermarks="watermarks"
              @add-watermark="addWatermark"
              @update-watermark="updateWatermark"
              @remove-watermark="removeWatermark"
              @apply-watermarks="applyWatermarks"
            />
          </UCard>
        </div>

        <!-- Right Panel - Preview -->
        <div class="lg:col-span-2">
          <UCard>
            <template #header>
              <h2 class="text-xl font-semibold">{{ t('preview.title') }}</h2>
            </template>
            <WatermarkPreview
              :images="selectedImages"
              :watermarks="watermarks"
              :is-processing="isProcessing"
            />
          </UCard>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-8 flex justify-center space-x-4">
        <UButton
          color="primary"
          variant="solid"
          :disabled="!selectedImages.length || isProcessing"
          @click="applyWatermarks"
        >
          {{ t('actions.apply') }}
        </UButton>
        <UButton
          color="secondary"
          variant="outline"
          :disabled="!selectedImages.length"
          @click="downloadImages"
        >
          {{ t('actions.download') }}
        </UButton>
        <UButton
          color="gray"
          variant="ghost"
          @click="resetAll"
        >
          {{ t('actions.reset') }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const {
  selectedImages,
  watermarks,
  currentWatermark,
  isProcessing,
  addWatermark,
  updateWatermark,
  removeWatermark,
  applyWatermarks,
  downloadImages,
  resetAll,
  updateCurrentWatermark,
  updateSelectedImages
} = useWatermark()
</script>