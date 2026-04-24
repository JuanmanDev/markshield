<template>
  <div class="flex items-center gap-2 overflow-x-auto px-4 py-2 scrollbar-hide min-h-[72px]">
    <button
      v-for="(image, index) in images"
      :key="index"
      class="group relative flex-shrink-0 w-16 h-[52px] rounded-lg overflow-hidden border-2 transition-all"
      :class="index === modelValue
        ? 'border-primary ring-1 ring-primary/50 shadow-lg shadow-primary/20'
        : 'border-white/10 hover:border-white/30'"
      @click="$emit('update:modelValue', index)"
      :title="image.file?.name"
    >
      <!-- PDF card -->
      <div v-if="image.type === 'application/pdf'" class="w-full h-full bg-surface-container flex flex-col items-center justify-center gap-0.5">
        <span class="material-symbols-outlined text-red-400 text-base" style="font-variation-settings:'FILL' 1">picture_as_pdf</span>
        <span v-if="image.pageCount" class="text-[7px] font-bold text-on-surface-variant">{{ image.pageCount }}p</span>
      </div>
      <!-- Image thumbnail -->
      <img v-else :src="image.preview" class="w-full h-full object-cover" />

      <!-- Index badge -->
      <div class="absolute bottom-0.5 left-0.5 bg-black/70 rounded px-1 text-[7px] font-bold text-white leading-tight">
        {{ index + 1 }}
      </div>

      <!-- Remove button -->
      <div
        role="button"
        tabindex="0"
        class="absolute top-0.5 right-0.5 w-4 h-4 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white/60 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
        @click.stop="$emit('remove-image', index)"
        @keydown.enter.stop="$emit('remove-image', index)"
        @keydown.space.stop.prevent="$emit('remove-image', index)"
        title="Remove"
      >
        <span class="material-symbols-outlined text-[10px]">close</span>
      </div>
    </button>

    <!-- Add more button -->
    <button
      class="flex-shrink-0 w-16 h-[52px] rounded-lg border-2 border-dashed border-white/20 hover:border-primary/50 hover:bg-white/5 flex flex-col items-center justify-center gap-0.5 transition-all"
      @click="$emit('add-more')"
      title="Add files"
    >
      <span class="material-symbols-outlined text-on-surface-variant text-base">add_photo_alternate</span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  images: { type: Array, required: true },
  modelValue: { type: Number, default: 0 }
})

defineEmits(['update:modelValue', 'remove-image', 'add-more'])
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
