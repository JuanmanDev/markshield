<template>
  <div class="space-y-3">
    <!-- Text Input (Always visible) -->
    <div class="space-y-3">
      <label class="text-xs font-medium text-on-surface-variant flex items-center gap-2">
        <span class="material-symbols-outlined text-sm">text_fields</span>
        {{ t('config.text') }}
      </label>
      <input
        type="text"
        v-model="localWatermark.text"
        @input="updateWatermark"
        :placeholder="t('config.textPlaceholder')"
        class="w-full bg-surface-container border border-white/5 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-white/20"
      />
    </div>

    <!-- Accordion Sections -->
    <!-- Basic Controls -->
    <div class="border border-white/5 rounded-xl overflow-hidden bg-surface-container-low/30">
      <button 
        @click="toggleSection('basic')" 
        class="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-on-surface hover:bg-white/5 transition-all"
      >
        <span class="flex items-center gap-2">
          <span class="material-symbols-outlined text-sm text-primary">tune</span>
          Basic Controls
        </span>
        <span class="material-symbols-outlined text-sm transition-transform" :class="{ 'rotate-180': openSections.basic }">expand_more</span>
      </button>
      
      <div v-if="openSections.basic" class="p-4 space-y-4 border-t border-white/5">
        <!-- Font Size & Rotation -->
        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-2">
            <label class="text-[10px] font-medium text-on-surface-variant flex justify-between">
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-xs">format_size</span>
                Size
              </span>
              <span class="text-primary font-bold">{{ localWatermark.fontSize }}px</span>
            </label>
            <input
              type="range"
              v-model="localWatermark.fontSize"
              @input="updateWatermark"
              min="8" max="300" step="1"
              class="w-full h-1 bg-surface-container rounded-full appearance-none accent-primary"
            />
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-medium text-on-surface-variant flex justify-between">
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-xs">rotate_right</span>
                Rotation
              </span>
              <span class="text-primary font-bold">{{ localWatermark.rotation }}°</span>
            </label>
            <input
              type="range"
              v-model="localWatermark.rotation"
              @input="updateWatermark"
              min="-180" max="180" step="1"
              class="w-full h-1 bg-surface-container rounded-full appearance-none accent-primary"
            />
          </div>
        </div>

        <!-- Opacity -->
        <div class="space-y-2">
          <label class="text-[10px] font-medium text-on-surface-variant flex justify-between">
            <span class="flex items-center gap-1">
              <span class="material-symbols-outlined text-xs">opacity</span>
              Opacity
            </span>
            <span class="text-primary font-bold">{{ Math.round(localWatermark.opacity * 100) }}%</span>
          </label>
          <input
            type="range"
            v-model="localWatermark.opacity"
            @input="updateWatermark"
            min="0" max="1" step="0.01"
            class="w-full h-1 bg-surface-container rounded-full appearance-none accent-primary"
          />
        </div>

        <!-- Position X & Y -->
        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-2">
            <label class="text-[10px] font-medium text-on-surface-variant flex justify-between">
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-xs">arrow_range</span>
                X
              </span>
              <span class="text-primary font-bold">{{ localWatermark.x }}%</span>
            </label>
            <input
              type="range"
              v-model="localWatermark.x"
              @input="updateWatermark"
              min="0" max="100" step="1"
              class="w-full h-1 bg-surface-container rounded-full appearance-none accent-primary"
            />
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-medium text-on-surface-variant flex justify-between">
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-xs">vertical_align_center</span>
                Y
              </span>
              <span class="text-primary font-bold">{{ localWatermark.y }}%</span>
            </label>
            <input
              type="range"
              v-model="localWatermark.y"
              @input="updateWatermark"
              min="0" max="100" step="1"
              class="w-full h-1 bg-surface-container rounded-full appearance-none accent-primary"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Color System -->
    <div class="border border-white/5 rounded-xl overflow-hidden bg-surface-container-low/30">
      <button 
        @click="toggleSection('color')" 
        class="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-on-surface hover:bg-white/5 transition-all"
      >
        <span class="flex items-center gap-2">
          <span class="material-symbols-outlined text-sm text-primary">palette</span>
          Colors & Effects
        </span>
        <span class="material-symbols-outlined text-sm transition-transform" :class="{ 'rotate-180': openSections.color }">expand_more</span>
      </button>
      
      <div v-if="openSections.color" class="p-4 space-y-4 border-t border-white/5">
        <!-- Color Mode Tabs -->
        <div class="flex gap-1 p-1 bg-surface-container rounded-lg">
          <button
            v-for="mode in colorModes"
            :key="mode.value"
            @click="localWatermark.colorMode = mode.value; updateWatermark()"
            class="flex-1 py-1.5 px-2 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all"
            :class="localWatermark.colorMode === mode.value ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'"
          >
            {{ mode.label }}
          </button>
        </div>

        <!-- Solid Color -->
        <div v-if="localWatermark.colorMode === 'solid'" class="flex items-center gap-3">
          <input
            type="color"
            v-model="localWatermark.color"
            @input="updateWatermark"
            class="w-10 h-10 rounded-lg cursor-pointer bg-surface-container border border-white/5"
          />
          <span class="text-xs font-bold uppercase tracking-wider text-on-surface">{{ localWatermark.color }}</span>
        </div>

        <!-- Gradient -->
        <div v-if="localWatermark.colorMode === 'gradient'" class="space-y-3">
          <div class="flex items-center gap-3">
            <input
              type="color"
              v-model="localWatermark.gradientStart"
              @input="updateWatermark"
              class="w-8 h-8 rounded cursor-pointer bg-surface-container border border-white/5"
            />
            <span class="text-[10px] text-on-surface-variant">Start</span>
            <input
              type="color"
              v-model="localWatermark.gradientEnd"
              @input="updateWatermark"
              class="w-8 h-8 rounded cursor-pointer bg-surface-container border border-white/5"
            />
            <span class="text-[10px] text-on-surface-variant">End</span>
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-medium text-on-surface-variant flex justify-between">
              Angle
              <span class="text-primary font-bold">{{ localWatermark.gradientAngle }}°</span>
            </label>
            <input
              type="range"
              v-model="localWatermark.gradientAngle"
              @input="updateWatermark"
              min="0" max="360" step="5"
              class="w-full h-1 bg-surface-container rounded-full appearance-none accent-primary"
            />
          </div>
        </div>

        <!-- Random Colors -->
        <div v-if="localWatermark.colorMode === 'random'" class="space-y-3">
          <div class="p-3 bg-surface-container rounded-lg space-y-2">
            <label class="text-[10px] font-medium text-on-surface-variant">Color Range</label>
            <div class="flex items-center gap-2">
              <input
                type="color"
                v-model="localWatermark.randomColorMin"
                @input="updateWatermark"
                class="w-6 h-6 rounded cursor-pointer bg-surface-container-highest border border-white/5"
              />
              <span class="text-[9px] text-on-surface-variant">Min</span>
              <input
                type="color"
                v-model="localWatermark.randomColorMax"
                @input="updateWatermark"
                class="w-6 h-6 rounded cursor-pointer bg-surface-container-highest border border-white/5"
              />
              <span class="text-[9px] text-on-surface-variant">Max</span>
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-medium text-on-surface-variant flex justify-between">
              Opacity Range
              <span class="text-primary font-bold">{{ Math.round(localWatermark.randomOpacityMin * 100) }}% - {{ Math.round(localWatermark.randomOpacityMax * 100) }}%</span>
            </label>
            <div class="flex gap-2">
              <input
                type="range"
                v-model="localWatermark.randomOpacityMin"
                @input="updateWatermark"
                min="0" max="1" step="0.05"
                class="flex-1 h-1 bg-surface-container rounded-full appearance-none accent-primary"
              />
              <input
                type="range"
                v-model="localWatermark.randomOpacityMax"
                @input="updateWatermark"
                min="0" max="1" step="0.05"
                class="flex-1 h-1 bg-surface-container rounded-full appearance-none accent-primary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Background & Border -->
    <div class="border border-white/5 rounded-xl overflow-hidden bg-surface-container-low/30">
      <button 
        @click="toggleSection('bg')" 
        class="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-on-surface hover:bg-white/5 transition-all"
      >
        <span class="flex items-center gap-2">
          <span class="material-symbols-outlined text-sm text-primary">layers</span>
          Background & Border
        </span>
        <span class="material-symbols-outlined text-sm transition-transform" :class="{ 'rotate-180': openSections.bg }">expand_more</span>
      </button>
      
      <div v-if="openSections.bg" class="p-4 space-y-4 border-t border-white/5">
        <!-- Background Settings -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <label class="text-[10px] font-medium text-on-surface-variant flex items-center gap-1">
              <span class="material-symbols-outlined text-xs">crop_square</span>
              Background
            </label>
            <button
              @click="localWatermark.bgEnabled = !localWatermark.bgEnabled; updateWatermark()"
              class="w-8 h-4 rounded-full transition-all"
              :class="localWatermark.bgEnabled ? 'bg-primary' : 'bg-surface-container-highest'"
            >
              <div
                class="w-3 h-3 bg-white rounded-full shadow-md transform transition-transform"
                :class="localWatermark.bgEnabled ? 'translate-x-4' : 'translate-x-0.5'"
              ></div>
            </button>
          </div>
          
          <div v-if="localWatermark.bgEnabled" class="space-y-2 pl-4">
            <div class="flex items-center gap-2">
              <input
                type="color"
                v-model="localWatermark.bgColor"
                @input="updateWatermark"
                class="w-6 h-6 rounded cursor-pointer bg-surface-container-highest border border-white/5"
              />
              <span class="text-[9px] text-on-surface-variant">Color</span>
            </div>
            <div class="space-y-1">
              <label class="text-[9px] font-medium text-on-surface-variant flex justify-between">
                Opacity
                <span class="text-primary font-bold">{{ Math.round(localWatermark.bgOpacity * 100) }}%</span>
              </label>
              <input
                type="range"
                v-model="localWatermark.bgOpacity"
                @input="updateWatermark"
                min="0" max="1" step="0.05"
                class="w-full h-1 bg-surface-container-highest rounded-full appearance-none accent-primary"
              />
            </div>
            <div class="space-y-1">
              <label class="text-[9px] font-medium text-on-surface-variant flex justify-between">
                Padding
                <span class="text-primary font-bold">{{ localWatermark.bgPadding }}px</span>
              </label>
              <input
                type="range"
                v-model="localWatermark.bgPadding"
                @input="updateWatermark"
                min="0" max="40" step="2"
                class="w-full h-1 bg-surface-container-highest rounded-full appearance-none accent-primary"
              />
            </div>
            <div class="space-y-1">
              <label class="text-[9px] font-medium text-on-surface-variant flex justify-between">
                Radius
                <span class="text-primary font-bold">{{ localWatermark.bgRadius }}px</span>
              </label>
              <input
                type="range"
                v-model="localWatermark.bgRadius"
                @input="updateWatermark"
                min="0" max="30" step="2"
                class="w-full h-1 bg-surface-container-highest rounded-full appearance-none accent-primary"
              />
            </div>
          </div>
        </div>

        <!-- Border Settings -->
        <div class="space-y-3 pt-3 border-t border-white/5">
          <div class="flex items-center justify-between">
            <label class="text-[10px] font-medium text-on-surface-variant flex items-center gap-1">
              <span class="material-symbols-outlined text-xs">border_style</span>
              Border
            </label>
            <button
              @click="localWatermark.borderEnabled = !localWatermark.borderEnabled; updateWatermark()"
              class="w-8 h-4 rounded-full transition-all"
              :class="localWatermark.borderEnabled ? 'bg-primary' : 'bg-surface-container-highest'"
            >
              <div
                class="w-3 h-3 bg-white rounded-full shadow-md transform transition-transform"
                :class="localWatermark.borderEnabled ? 'translate-x-4' : 'translate-x-0.5'"
              ></div>
            </button>
          </div>
          
          <div v-if="localWatermark.borderEnabled" class="space-y-2 pl-4">
            <div class="flex items-center gap-2">
              <input
                type="color"
                v-model="localWatermark.borderColor"
                @input="updateWatermark"
                class="w-6 h-6 rounded cursor-pointer bg-surface-container-highest border border-white/5"
              />
              <span class="text-[9px] text-on-surface-variant">Color</span>
            </div>
            <div class="space-y-1">
              <label class="text-[9px] font-medium text-on-surface-variant flex justify-between">
                Width
                <span class="text-primary font-bold">{{ localWatermark.borderWidth }}px</span>
              </label>
              <input
                type="range"
                v-model="localWatermark.borderWidth"
                @input="updateWatermark"
                min="0" max="10" step="0.5"
                class="w-full h-1 bg-surface-container-highest rounded-full appearance-none accent-primary"
              />
            </div>
            <div class="space-y-1">
              <label class="text-[9px] font-medium text-on-surface-variant">Style</label>
              <div class="grid grid-cols-3 gap-1">
                <button
                  v-for="style in borderStyles"
                  :key="style.value"
                  @click="localWatermark.borderStyle = style.value; updateWatermark()"
                  class="py-1.5 px-2 rounded-lg text-[8px] font-bold uppercase tracking-wider transition-all border border-white/10"
                  :class="localWatermark.borderStyle === style.value ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-highest text-on-surface-variant hover:text-on-surface'"
                >
                  {{ style.label }}
                </button>
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-[9px] font-medium text-on-surface-variant flex justify-between">
                Radius
                <span class="text-primary font-bold">{{ localWatermark.borderRadius }}px</span>
              </label>
              <input
                type="range"
                v-model="localWatermark.borderRadius"
                @input="updateWatermark"
                min="0" max="20" step="1"
                class="w-full h-1 bg-surface-container-highest rounded-full appearance-none accent-primary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Repeat Pattern -->
    <div class="border border-white/5 rounded-xl overflow-hidden bg-surface-container-low/30">
      <button 
        @click="toggleSection('pattern')" 
        class="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-on-surface hover:bg-white/5 transition-all"
      >
        <span class="flex items-center gap-2">
          <span class="material-symbols-outlined text-sm text-primary">grid_view</span>
          Repeat Pattern
        </span>
        <span class="material-symbols-outlined text-sm transition-transform" :class="{ 'rotate-180': openSections.pattern }">expand_more</span>
      </button>
      
      <div v-if="openSections.pattern" class="p-4 space-y-3 border-t border-white/5">
        <div class="flex items-center justify-between">
          <label class="text-[10px] font-medium text-on-surface-variant flex items-center gap-1">
            Enable Pattern
          </label>
          <button
            @click="localWatermark.pattern = !localWatermark.pattern; updateWatermark()"
            class="w-8 h-4 rounded-full transition-all"
            :class="localWatermark.pattern ? 'bg-primary' : 'bg-surface-container-highest'"
          >
            <div
              class="w-3 h-3 bg-white rounded-full shadow-md transform transition-transform"
              :class="localWatermark.pattern ? 'translate-x-4' : 'translate-x-0.5'"
            ></div>
          </button>
        </div>
        
        <div v-if="localWatermark.pattern" class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-2">
              <label class="text-[9px] font-medium text-on-surface-variant flex justify-between">
                <span class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-xs">arrow_range</span>
                  X Spacing
                </span>
                <span class="text-primary font-bold">{{ localWatermark.patternSpacingX }}px</span>
              </label>
              <input
                type="range"
                v-model="localWatermark.patternSpacingX"
                @input="updateWatermark"
                min="50" max="1000" step="10"
                class="w-full h-1 bg-surface-container-highest rounded-full appearance-none accent-primary"
              />
            </div>
            <div class="space-y-2">
              <label class="text-[9px] font-medium text-on-surface-variant flex justify-between">
                <span class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-xs">vertical_align_center</span>
                  Y Spacing
                </span>
                <span class="text-primary font-bold">{{ localWatermark.patternSpacingY }}px</span>
              </label>
              <input
                type="range"
                v-model="localWatermark.patternSpacingY"
                @input="updateWatermark"
                min="50" max="1000" step="10"
                class="w-full h-1 bg-surface-container-highest rounded-full appearance-none accent-primary"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-[9px] font-medium text-on-surface-variant flex justify-between">
              Line Offset
              <span class="text-primary font-bold">{{ localWatermark.patternOffset }}px</span>
            </label>
            <input
              type="range"
              v-model="localWatermark.patternOffset"
              @input="updateWatermark"
              min="0" max="400" step="5"
              class="w-full h-1 bg-surface-container-highest rounded-full appearance-none accent-primary"
            />
          </div>

          <div class="flex items-center justify-between">
            <label class="text-[9px] font-medium text-on-surface-variant flex items-center gap-1">
              <span class="material-symbols-outlined text-xs">shuffle</span>
              Random Offset
            </label>
            <button
              @click="localWatermark.patternRandomOffset = !localWatermark.patternRandomOffset; updateWatermark()"
              class="w-8 h-4 rounded-full transition-all"
              :class="localWatermark.patternRandomOffset ? 'bg-primary' : 'bg-surface-container-highest'"
            >
              <div
                class="w-3 h-3 bg-white rounded-full shadow-md transform transition-transform"
                :class="localWatermark.patternRandomOffset ? 'translate-x-4' : 'translate-x-0.5'"
              ></div>
            </button>
          </div>

          <!-- Line Height Multiplier -->
          <div class="space-y-2 pt-3 border-t border-white/5">
            <label class="text-[9px] font-medium text-on-surface-variant flex justify-between">
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-xs">format_line_spacing</span>
                Line Spacing
              </span>
              <span class="text-primary font-bold">{{ localWatermark.lineHeightMultiplier }}x</span>
            </label>
            <input
              type="range"
              v-model="localWatermark.lineHeightMultiplier"
              @input="updateWatermark"
              min="1" max="3" step="0.1"
              class="w-full h-1 bg-surface-container-highest rounded-full appearance-none accent-primary"
            />
          </div>

          <!-- Pattern Rotation -->
          <div class="space-y-2 pt-3 border-t border-white/5">
            <label class="text-[9px] font-medium text-on-surface-variant flex justify-between">
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-xs">rotate_right</span>
                Pattern Rotation
              </span>
              <span class="text-primary font-bold">{{ localWatermark.patternRotation || localWatermark.rotation || 0 }}°</span>
            </label>
            <input
              type="range"
              v-model="localWatermark.patternRotation"
              @input="updateWatermark"
              min="-180" max="180" step="1"
              class="w-full h-1 bg-surface-container-highest rounded-full appearance-none accent-primary"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Apply Button -->
    <button
      @click="applyWatermark"
      class="w-full py-3 rounded-xl bg-primary hover:bg-primary-dim text-on-primary text-sm font-bold transition-all shadow-[0_0_20px_rgba(102,126,234,0.3)] hover:shadow-[0_0_30px_rgba(102,126,234,0.5)] flex items-center justify-center gap-2"
    >
      <span class="material-symbols-outlined text-sm">add_circle</span>
      {{ t('config.apply') }}
    </button>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
  watermark: {
    type: Object,
    required: true
  }
})

const colorModes = [
  { value: 'solid', label: 'Solid' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'random', label: 'Random' }
]

const borderStyles = [
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' }
]

// Collapsible sections state
const openSections = reactive({
  basic: true,
  color: false,
  bg: false,
  pattern: false
})

const toggleSection = (section) => {
  openSections[section] = !openSections[section]
}

const localWatermark = reactive({
  // New properties with defaults
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
  patternSpacingX: 3,
  patternSpacingY: 2.5,
  patternSpacingUnit: 'lines',
  patternOffset: 1.5,
  patternRandomOffset: false,
  patternRotation: 0, // Rotation for entire pattern matrix
  lineHeightMultiplier: 1.5, // Line height multiplier
  ...props.watermark
})

// Watch for prop changes to update local state (e.g. when applying suggestions)
watch(() => props.watermark, (newVal) => {
  Object.assign(localWatermark, newVal)
}, { deep: true })

const emit = defineEmits(['update:watermark'])

// Update watermark and emit changes
const updateWatermark = () => {
  // Ensure numeric values
  localWatermark.fontSize = Number(localWatermark.fontSize)
  localWatermark.opacity = Number(localWatermark.opacity)
  localWatermark.x = Number(localWatermark.x)
  localWatermark.y = Number(localWatermark.y)
  localWatermark.rotation = Number(localWatermark.rotation)
  localWatermark.gradientAngle = Number(localWatermark.gradientAngle)
  localWatermark.randomOpacityMin = Number(localWatermark.randomOpacityMin)
  localWatermark.randomOpacityMax = Number(localWatermark.randomOpacityMax)
  localWatermark.bgOpacity = Number(localWatermark.bgOpacity)
  localWatermark.bgPadding = Number(localWatermark.bgPadding)
  localWatermark.bgRadius = Number(localWatermark.bgRadius)
  localWatermark.borderWidth = Number(localWatermark.borderWidth)
  localWatermark.borderOpacity = Number(localWatermark.borderOpacity)
  localWatermark.borderRadius = Number(localWatermark.borderRadius)
  localWatermark.patternSpacingX = Number(localWatermark.patternSpacingX)
  localWatermark.patternSpacingY = Number(localWatermark.patternSpacingY)
  localWatermark.patternOffset = Number(localWatermark.patternOffset)
  localWatermark.lineHeightMultiplier = Number(localWatermark.lineHeightMultiplier)
  localWatermark.patternRotation = Number(localWatermark.patternRotation)

  emit('update:watermark', { ...localWatermark })
}

// Apply watermark to the list
const applyWatermark = () => {
  emit('update:watermark', { ...localWatermark })
}
</script>
