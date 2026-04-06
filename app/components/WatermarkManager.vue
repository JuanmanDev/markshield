<template>
  <div class="space-y-4">
    <!-- Watermark List -->
    <div v-if="watermarks.length > 0" class="space-y-3">
      <div 
        v-for="(watermark, index) in watermarks" 
        :key="index"
        class="border rounded-lg p-3 bg-gray-50"
      >
        <div class="flex justify-between items-center">
          <div class="font-medium">{{ watermark.text }}</div>
          <div class="flex space-x-2">
            <UButton 
              color="secondary" 
              variant="ghost" 
              size="sm"
              @click="editWatermark(index)"
            >
              {{ t('manager.edit') }}
            </UButton>
            <UButton 
              color="error" 
              variant="ghost" 
              size="sm"
              @click="removeWatermark(index)"
            >
              {{ t('manager.remove') }}
            </UButton>
          </div>
        </div>
        <div class="text-sm text-gray-600 mt-1">
          {{ t('manager.fontSize') }}: {{ watermark.fontSize }}px | 
          {{ t('manager.color') }}: {{ watermark.color }} | 
          {{ t('manager.opacity') }}: {{ Math.round(watermark.opacity * 100) }}%
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8 text-gray-500">
      {{ t('manager.empty') }}
    </div>

    <!-- Action Buttons -->
    <div class="flex space-x-2 pt-2">
      <UButton 
        color="primary" 
        variant="solid" 
        @click="addWatermark"
        class="flex-1"
      >
        {{ t('manager.add') }}
      </UButton>
      <UButton 
        color="secondary" 
        variant="outline" 
        @click="applyWatermarks"
        :disabled="watermarks.length === 0"
        class="flex-1"
      >
        {{ t('manager.applyAll') }}
      </UButton>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
  watermarks: {
    type: Array,
    required: true
  }
})

const emit = defineEmits([
  'add-watermark',
  'update-watermark',
  'remove-watermark',
  'apply-watermarks'
])

// Add a new watermark
const addWatermark = () => {
  emit('add-watermark')
}

// Edit a watermark
const editWatermark = (index) => {
  emit('update-watermark', index)
}

// Remove a watermark
const removeWatermark = (index) => {
  emit('remove-watermark', index)
}

// Apply all watermarks
const applyWatermarks = () => {
  emit('apply-watermarks')
}
</script>