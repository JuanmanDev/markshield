<template>
  <div class="space-y-6">
    <!-- Action Buttons -->
    <div class="flex items-center gap-2 mb-4">
      <button 
        @click="addWatermark"
        class="flex-1 py-2.5 rounded-lg bg-surface-container hover:bg-white/5 border border-white/5 text-on-surface text-xs font-bold transition-all flex items-center justify-center gap-2 group"
      >
        <span class="material-symbols-outlined text-[16px] group-hover:-translate-y-0.5 transition-transform">add</span>
        {{ t('manager.add') }}
      </button>
      <button 
        @click="applyWatermarks"
        :disabled="watermarks.length === 0"
        class="flex-1 py-2.5 rounded-lg border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
      >
        <span class="material-symbols-outlined text-[16px] group-hover:rotate-180 transition-transform">autorenew</span>
        {{ t('manager.applyAll') }}
      </button>
    </div>

    <!-- Watermark List -->
    <div v-if="watermarks.length > 0" class="space-y-3">
      <div 
        v-for="(watermark, index) in watermarks" 
        :key="index"
        class="border border-white/5 rounded-xl p-4 bg-surface-container-low transition-all hover:border-white/10"
      >
        <div class="flex justify-between items-start mb-2">
          <div class="font-bold text-sm text-on-surface truncate pr-4">{{ watermark.text }}</div>
          <div class="flex space-x-1 shrink-0">
            <button 
              @click="editWatermark(index)"
              class="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white/10 text-on-surface-variant hover:text-primary transition-colors"
              title="Edit"
            >
              <span class="material-symbols-outlined text-[14px]">edit</span>
            </button>
            <button 
              @click="removeWatermark(index)"
               class="w-6 h-6 flex items-center justify-center rounded-md hover:bg-error/20 text-on-surface-variant hover:text-error transition-colors"
               title="Remove"
            >
              <span class="material-symbols-outlined text-[14px]">delete</span>
            </button>
          </div>
        </div>
        <div class="flex gap-3 text-[10px] font-medium text-outline uppercase tracking-wider">
          <span>{{ watermark.fontSize }}px</span>
          <span>&bull;</span>
          <span>{{ watermark.color }}</span>
          <span>&bull;</span>
          <span>{{ Math.round(watermark.opacity * 100) }}% Opacity</span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-6 text-on-surface-variant text-sm border border-dashed border-white/10 rounded-xl">
      {{ t('manager.empty') }}
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