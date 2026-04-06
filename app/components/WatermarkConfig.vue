<template>
  <div class="space-y-4">
    <!-- Text Input -->
    <UFormGroup :label="t('config.text')" class="w-full">
      <UInput 
        v-model="localWatermark.text" 
        :placeholder="t('config.textPlaceholder')"
        @update:model-value="updateWatermark"
      />
    </UFormGroup>

    <!-- Font Size -->
    <UFormGroup :label="t('config.fontSize')">
      <USlider 
        v-model="localWatermark.fontSize" 
        :min="8" 
        :max="100" 
        :step="1"
        @update:model-value="updateWatermark"
      />
      <div class="text-sm text-gray-500 mt-1">{{ localWatermark.fontSize }}px</div>
    </UFormGroup>

    <!-- Color Picker -->
    <UFormGroup :label="t('config.color')">
      <div class="flex items-center space-x-2">
        <UColorPicker 
          v-model="localWatermark.color" 
          @update:model-value="updateWatermark"
        />
        <span class="text-sm">{{ localWatermark.color }}</span>
      </div>
    </UFormGroup>

    <!-- Opacity -->
    <UFormGroup :label="t('config.opacity')">
      <USlider 
        v-model="localWatermark.opacity" 
        :min="0" 
        :max="1" 
        :step="0.01"
        @update:model-value="updateWatermark"
      />
      <div class="text-sm text-gray-500 mt-1">{{ Math.round(localWatermark.opacity * 100) }}%</div>
    </UFormGroup>

    <!-- Position Controls -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UFormGroup :label="t('config.positionX')">
        <USlider 
          v-model="localWatermark.x" 
          :min="0" 
          :max="100" 
          :step="1"
          @update:model-value="updateWatermark"
        />
        <div class="text-sm text-gray-500 mt-1">{{ localWatermark.x }}%</div>
      </UFormGroup>

      <UFormGroup :label="t('config.positionY')">
        <USlider 
          v-model="localWatermark.y" 
          :min="0" 
          :max="100" 
          :step="1"
          @update:model-value="updateWatermark"
        />
        <div class="text-sm text-gray-500 mt-1">{{ localWatermark.y }}%</div>
      </UFormGroup>
    </div>

    <!-- Apply Button -->
    <UButton 
      color="primary" 
      variant="solid" 
      @click="applyWatermark"
      class="w-full"
    >
      {{ t('config.apply') }}
    </UButton>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
  watermark: {
    type: Object,
    required: true
  }
})

const localWatermark = reactive({ ...props.watermark })

const emit = defineEmits(['update:watermark'])

// Update watermark and emit changes
const updateWatermark = () => {
  emit('update:watermark', { ...localWatermark })
}

// Apply watermark to the list
const applyWatermark = () => {
  emit('update:watermark', { ...localWatermark })
}
</script>