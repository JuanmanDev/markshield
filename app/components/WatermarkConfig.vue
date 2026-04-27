<template>
  <div class="space-y-3">
    <!-- Text Input -->
    <div class="space-y-3">
      <label class="text-xs font-medium text-on-surface-variant flex items-center gap-2">
        <span class="material-symbols-outlined text-sm">text_fields</span>
        {{ t('config.text') }}
      </label>
      <textarea
        v-model="localWatermark.text"
        @input="updateWatermark"
        :placeholder="t('config.textPlaceholder')"
        rows="3"
        class="w-full bg-surface-container border border-white/5 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-white/20 resize-none leading-snug"
      />
    </div>

    <!-- Basic Controls -->
    <div class="border border-white/5 rounded-xl overflow-hidden bg-surface-container-low/30">
      <button @click="toggleSection('basic')" class="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-on-surface hover:bg-white/5 transition-all">
        <span class="flex items-center gap-2">
          <span class="material-symbols-outlined text-sm text-primary">tune</span>
          Basic Controls
        </span>
        <span class="material-symbols-outlined text-sm transition-transform" :class="{ 'rotate-180': openSections.basic }">expand_more</span>
      </button>

      <div v-if="openSections.basic" class="p-4 space-y-3 border-t border-white/5">
        <!-- Font Size -->
        <div class="space-y-1">
          <div class="flex items-center justify-between">
            <label class="text-[10px] font-medium text-on-surface-variant flex items-center gap-1">
              <span class="material-symbols-outlined text-xs">format_size</span>Size
            </label>
            <button @click="localWatermark.randomizeSize = !localWatermark.randomizeSize; updateWatermark()" class="text-[8px] font-bold px-1.5 py-0.5 rounded transition-all" :class="localWatermark.randomizeSize ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'">~</button>
          </div>
          <div v-if="!localWatermark.randomizeSize" class="flex items-center gap-1.5">
            <input type="range" v-model.number="localWatermark.fontSize" @input="updateWatermark" min="8" max="300" step="1" class="flex-1 h-1 bg-surface-container rounded-full appearance-none accent-primary" />
            <input type="number" v-model.number="localWatermark.fontSize" @change="updateWatermark" class="w-14 bg-surface-container-highest border border-white/10 rounded px-1 py-0.5 text-[10px] text-on-surface text-right focus:outline-none focus:border-primary" min="1" />
          </div>
          <div v-else class="grid grid-cols-2 gap-1.5">
            <div><label class="text-[8px] text-on-surface-variant">Min px</label><input type="number" v-model.number="localWatermark.sizeMin" @change="updateWatermark" class="w-full bg-surface-container-highest border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface text-right focus:outline-none focus:border-primary" min="1" /></div>
            <div><label class="text-[8px] text-on-surface-variant">Max px</label><input type="number" v-model.number="localWatermark.sizeMax" @change="updateWatermark" class="w-full bg-surface-container-highest border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface text-right focus:outline-none focus:border-primary" min="1" /></div>
          </div>
        </div>

        <!-- Rotation -->
        <div class="space-y-1" :class="localWatermark.pattern ? 'opacity-40 pointer-events-none' : ''">
          <div class="flex items-center justify-between">
            <label class="text-[10px] font-medium text-on-surface-variant flex items-center gap-1">
              <span class="material-symbols-outlined text-xs">rotate_right</span>
              Rotation
              <span v-if="localWatermark.pattern" class="text-[8px] text-on-surface-variant/50">(use Pattern Rotation)</span>
            </label>
            <button @click="localWatermark.randomizeRotation = !localWatermark.randomizeRotation; updateWatermark()" class="text-[8px] font-bold px-1.5 py-0.5 rounded transition-all" :class="localWatermark.randomizeRotation ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'">~</button>
          </div>
          <div v-if="!localWatermark.randomizeRotation" class="flex items-center gap-1.5">
            <input type="range" v-model.number="localWatermark.rotation" @input="updateWatermark" min="-180" max="180" step="1" class="flex-1 h-1 bg-surface-container rounded-full appearance-none accent-primary" />
            <input type="number" v-model.number="localWatermark.rotation" @change="updateWatermark" class="w-14 bg-surface-container-highest border border-white/10 rounded px-1 py-0.5 text-[10px] text-on-surface text-right focus:outline-none focus:border-primary" min="-360" max="360" />
          </div>
          <div v-else class="grid grid-cols-2 gap-1.5">
            <div><label class="text-[8px] text-on-surface-variant">Min °</label><input type="number" v-model.number="localWatermark.rotationMin" @change="updateWatermark" class="w-full bg-surface-container-highest border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface text-right focus:outline-none focus:border-primary" min="-360" max="360" /></div>
            <div><label class="text-[8px] text-on-surface-variant">Max °</label><input type="number" v-model.number="localWatermark.rotationMax" @change="updateWatermark" class="w-full bg-surface-container-highest border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface text-right focus:outline-none focus:border-primary" min="-360" max="360" /></div>
          </div>
        </div>

        <!-- Opacity -->
        <div class="space-y-1">
          <div class="flex items-center justify-between">
            <label class="text-[10px] font-medium text-on-surface-variant flex items-center gap-1">
              <span class="material-symbols-outlined text-xs">opacity</span>Opacity
            </label>
            <button @click="localWatermark.randomizeOpacity = !localWatermark.randomizeOpacity; updateWatermark()" class="text-[8px] font-bold px-1.5 py-0.5 rounded transition-all" :class="localWatermark.randomizeOpacity ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'">~</button>
          </div>
          <div v-if="!localWatermark.randomizeOpacity" class="flex items-center gap-1.5">
            <input type="range" v-model.number="localWatermark.opacity" @input="updateWatermark" min="0" max="1" step="0.01" class="flex-1 h-1 bg-surface-container rounded-full appearance-none accent-primary" />
            <input type="number" v-model.number="localWatermark.opacity" @change="updateWatermark" class="w-14 bg-surface-container-highest border border-white/10 rounded px-1 py-0.5 text-[10px] text-on-surface text-right focus:outline-none focus:border-primary" min="0" max="1" step="0.01" />
          </div>
          <div v-else class="grid grid-cols-2 gap-1.5">
            <div><label class="text-[8px] text-on-surface-variant">Min</label><input type="number" v-model.number="localWatermark.opacityMin" @change="updateWatermark" class="w-full bg-surface-container-highest border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface text-right focus:outline-none focus:border-primary" min="0" max="1" step="0.01" /></div>
            <div><label class="text-[8px] text-on-surface-variant">Max</label><input type="number" v-model.number="localWatermark.opacityMax" @change="updateWatermark" class="w-full bg-surface-container-highest border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface text-right focus:outline-none focus:border-primary" min="0" max="1" step="0.01" /></div>
          </div>
        </div>

        <!-- Position X & Y — single compact line each -->
        <div class="space-y-1" :class="localWatermark.pattern ? 'opacity-40 pointer-events-none' : ''">
          <label class="text-[10px] font-medium text-on-surface-variant flex items-center gap-1">
            Position
            <span v-if="localWatermark.pattern" class="text-[8px] text-on-surface-variant/50">(n/a in pattern mode)</span>
          </label>
          <div class="flex items-center gap-1.5">
            <span class="text-[9px] font-bold text-on-surface-variant/60 w-3 shrink-0">X</span>
            <input type="range" v-model.number="localWatermark.x" @input="updateWatermark" min="0" max="100" step="0.5" class="flex-1 h-1 bg-surface-container rounded-full appearance-none accent-primary" />
            <input type="number" v-model.number="localWatermark.x" @change="updateWatermark" class="w-14 bg-surface-container-highest border border-white/10 rounded px-1 py-0.5 text-[10px] text-on-surface text-right focus:outline-none focus:border-primary" min="0" max="100" step="0.5" />
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-[9px] font-bold text-on-surface-variant/60 w-3 shrink-0">Y</span>
            <input type="range" v-model.number="localWatermark.y" @input="updateWatermark" min="0" max="100" step="0.5" class="flex-1 h-1 bg-surface-container rounded-full appearance-none accent-primary" />
            <input type="number" v-model.number="localWatermark.y" @change="updateWatermark" class="w-14 bg-surface-container-highest border border-white/10 rounded px-1 py-0.5 text-[10px] text-on-surface text-right focus:outline-none focus:border-primary" min="0" max="100" step="0.5" />
          </div>
        </div>
      </div>
    </div>

    <!-- Color System -->
    <div class="border border-white/5 rounded-xl overflow-hidden bg-surface-container-low/30">
      <button @click="toggleSection('color')" class="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-on-surface hover:bg-white/5 transition-all">
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
            v-for="mode in colorModes" :key="mode.value"
            @click="localWatermark.colorMode = mode.value; updateWatermark()"
            class="flex-1 py-1.5 px-2 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all"
            :class="localWatermark.colorMode === mode.value ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'"
          >{{ mode.label }}</button>
        </div>

        <!-- Solid Color -->
        <div v-if="localWatermark.colorMode === 'solid'" class="flex items-center gap-3">
          <input type="color" v-model="localWatermark.color" @input="updateWatermark" class="w-10 h-10 rounded-lg cursor-pointer bg-surface-container border border-white/5" />
          <span class="text-xs font-bold uppercase tracking-wider text-on-surface">{{ localWatermark.color }}</span>
        </div>

        <!-- Gradient -->
        <div v-if="localWatermark.colorMode === 'gradient'" class="space-y-3">
          <div class="flex items-center gap-3">
            <input type="color" v-model="localWatermark.gradientStart" @input="updateWatermark" class="w-8 h-8 rounded cursor-pointer bg-surface-container border border-white/5" />
            <span class="text-[10px] text-on-surface-variant">Start</span>
            <input type="color" v-model="localWatermark.gradientEnd" @input="updateWatermark" class="w-8 h-8 rounded cursor-pointer bg-surface-container border border-white/5" />
            <span class="text-[10px] text-on-surface-variant">End</span>
          </div>
          <div class="space-y-1.5">
            <label class="text-[10px] font-medium text-on-surface-variant">Angle</label>
            <div class="flex items-center gap-1.5">
              <input type="range" v-model.number="localWatermark.gradientAngle" @input="updateWatermark" min="0" max="360" step="5" class="flex-1 h-1 bg-surface-container rounded-full appearance-none accent-primary" />
              <input type="number" v-model.number="localWatermark.gradientAngle" @change="updateWatermark" class="w-14 bg-surface-container-highest border border-white/10 rounded px-1 py-0.5 text-[10px] text-on-surface text-right focus:outline-none focus:border-primary" min="0" max="360" />
            </div>
          </div>
        </div>

        <!-- Random Colors -->
        <div v-if="localWatermark.colorMode === 'random'" class="space-y-3">
          <div class="p-3 bg-surface-container rounded-lg space-y-2">
            <label class="text-[10px] font-medium text-on-surface-variant">Color Range</label>
            <div class="flex items-center gap-2">
              <input type="color" v-model="localWatermark.randomColorMin" @input="updateWatermark" class="w-6 h-6 rounded cursor-pointer border border-white/5" />
              <span class="text-[9px] text-on-surface-variant">Min</span>
              <input type="color" v-model="localWatermark.randomColorMax" @input="updateWatermark" class="w-6 h-6 rounded cursor-pointer border border-white/5" />
              <span class="text-[9px] text-on-surface-variant">Max</span>
            </div>
          </div>
          <div class="space-y-1.5">
            <label class="text-[10px] font-medium text-on-surface-variant">Opacity Range</label>
            <div class="flex gap-2">
              <input type="range" v-model.number="localWatermark.randomOpacityMin" @input="updateWatermark" min="0" max="1" step="0.05" class="flex-1 h-1 bg-surface-container rounded-full appearance-none accent-primary" />
              <input type="range" v-model.number="localWatermark.randomOpacityMax" @input="updateWatermark" min="0" max="1" step="0.05" class="flex-1 h-1 bg-surface-container rounded-full appearance-none accent-primary" />
            </div>
          </div>
        </div>

        <!-- Text Cutout Toggle -->
        <div class="pt-3 border-t border-white/5">
          <div class="flex items-center justify-between">
            <label class="text-[10px] font-medium text-on-surface-variant flex items-center gap-1">
              <span class="material-symbols-outlined text-xs">filter_none</span>
              Cutout Text (inverted)
            </label>
            <button @click="toggleCutout" class="w-8 h-4 rounded-full transition-all" :class="localWatermark.textCutout ? 'bg-primary' : 'bg-surface-container-highest'">
              <div class="w-3 h-3 bg-white rounded-full shadow-md transform transition-transform" :class="localWatermark.textCutout ? 'translate-x-4' : 'translate-x-0.5'"></div>
            </button>
          </div>
          <p v-if="localWatermark.textCutout" class="text-[9px] text-on-surface-variant/60 mt-1">Opacity 0 = pure hole. Raise opacity to blend text over the cutout.</p>
        </div>

        <!-- Text Stroke / Outline -->
        <div class="pt-3 border-t border-white/5">
          <div class="flex items-center justify-between mb-2">
            <label class="text-[10px] font-medium text-on-surface-variant flex items-center gap-1">
              <span class="material-symbols-outlined text-xs">border_color</span>
              Text Outline
            </label>
            <button @click="localWatermark.textStrokeEnabled = !localWatermark.textStrokeEnabled; updateWatermark()" class="w-8 h-4 rounded-full transition-all" :class="localWatermark.textStrokeEnabled ? 'bg-primary' : 'bg-surface-container-highest'">
              <div class="w-3 h-3 bg-white rounded-full shadow-md transform transition-transform" :class="localWatermark.textStrokeEnabled ? 'translate-x-4' : 'translate-x-0.5'"></div>
            </button>
          </div>

          <div v-if="localWatermark.textStrokeEnabled" class="space-y-2 pl-4">
            <!-- Stroke Color Mode -->
            <div class="flex gap-1 p-0.5 bg-surface-container rounded-md">
              <button v-for="m in colorModes" :key="m.value" @click="localWatermark.textStrokeColorMode = m.value; updateWatermark()" class="flex-1 py-1 px-1 rounded text-[8px] font-bold uppercase tracking-wider transition-all" :class="localWatermark.textStrokeColorMode === m.value ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'">{{ m.label }}</button>
            </div>
            <div v-if="localWatermark.textStrokeColorMode === 'solid'" class="flex items-center gap-2">
              <input type="color" v-model="localWatermark.textStrokeColor" @input="updateWatermark" class="w-6 h-6 rounded cursor-pointer border border-white/5" />
              <span class="text-[9px] font-bold uppercase tracking-wider text-on-surface">{{ localWatermark.textStrokeColor }}</span>
            </div>
            <div v-if="localWatermark.textStrokeColorMode === 'gradient'" class="space-y-1.5">
              <div class="flex items-center gap-2">
                <input type="color" v-model="localWatermark.textStrokeGradientStart" @input="updateWatermark" class="w-6 h-6 rounded cursor-pointer border border-white/5" />
                <span class="text-[9px] text-on-surface-variant">Start</span>
                <input type="color" v-model="localWatermark.textStrokeGradientEnd" @input="updateWatermark" class="w-6 h-6 rounded cursor-pointer border border-white/5" />
                <span class="text-[9px] text-on-surface-variant">End</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="text-[9px] text-on-surface-variant w-8 shrink-0">Angle</span>
                <input type="range" v-model.number="localWatermark.textStrokeGradientAngle" @input="updateWatermark" min="0" max="360" step="5" class="flex-1 h-1 bg-surface-container-highest rounded-full appearance-none accent-primary" />
                <input type="number" v-model.number="localWatermark.textStrokeGradientAngle" @change="updateWatermark" class="w-12 bg-surface-container border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface text-right focus:outline-none focus:border-primary" min="0" max="360" />
              </div>
            </div>
            <div v-if="localWatermark.textStrokeColorMode === 'random'" class="flex items-center gap-2">
              <input type="color" v-model="localWatermark.textStrokeRandomColorMin" @input="updateWatermark" class="w-6 h-6 rounded cursor-pointer border border-white/5" />
              <span class="text-[9px] text-on-surface-variant">Min</span>
              <input type="color" v-model="localWatermark.textStrokeRandomColorMax" @input="updateWatermark" class="w-6 h-6 rounded cursor-pointer border border-white/5" />
              <span class="text-[9px] text-on-surface-variant">Max</span>
            </div>

            <!-- Stroke Width -->
            <div class="space-y-1">
              <label class="text-[9px] font-medium text-on-surface-variant">Width</label>
              <div class="flex items-center gap-1.5">
                <input type="range" v-model.number="localWatermark.textStrokeWidth" @input="updateWatermark" min="0.5" max="20" step="0.5" class="flex-1 h-1 bg-surface-container-highest rounded-full appearance-none accent-primary" />
                <input type="number" v-model.number="localWatermark.textStrokeWidth" @change="updateWatermark" class="w-14 bg-surface-container border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface text-right focus:outline-none focus:border-primary" min="0.5" step="0.5" />
              </div>
            </div>

            <!-- Stroke Opacity -->
            <div class="space-y-1">
              <label class="text-[9px] font-medium text-on-surface-variant">Opacity</label>
              <div class="flex items-center gap-1.5">
                <input type="range" v-model.number="localWatermark.textStrokeOpacity" @input="updateWatermark" min="0" max="1" step="0.01" class="flex-1 h-1 bg-surface-container-highest rounded-full appearance-none accent-primary" />
                <input type="number" v-model.number="localWatermark.textStrokeOpacity" @change="updateWatermark" class="w-14 bg-surface-container border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface text-right focus:outline-none focus:border-primary" min="0" max="1" step="0.01" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Background & Border -->
    <div class="border border-white/5 rounded-xl overflow-hidden bg-surface-container-low/30">
      <button @click="toggleSection('bg')" class="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-on-surface hover:bg-white/5 transition-all">
        <span class="flex items-center gap-2">
          <span class="material-symbols-outlined text-sm text-primary">layers</span>
          Background & Border
        </span>
        <span class="material-symbols-outlined text-sm transition-transform" :class="{ 'rotate-180': openSections.bg }">expand_more</span>
      </button>

      <div v-if="openSections.bg" class="p-4 space-y-4 border-t border-white/5">
        <!-- Background -->
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
              <div class="w-3 h-3 bg-white rounded-full shadow-md transform transition-transform" :class="localWatermark.bgEnabled ? 'translate-x-4' : 'translate-x-0.5'"></div>
            </button>
          </div>

          <div v-if="localWatermark.bgEnabled" class="space-y-2 pl-4">
            <!-- BG Color Mode -->
            <div class="flex gap-1 p-0.5 bg-surface-container rounded-md">
              <button v-for="m in colorModes" :key="m.value" @click="localWatermark.bgColorMode = m.value; updateWatermark()" class="flex-1 py-1 px-1 rounded text-[8px] font-bold uppercase tracking-wider transition-all" :class="localWatermark.bgColorMode === m.value ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'">{{ m.label }}</button>
            </div>
            <div v-if="localWatermark.bgColorMode === 'solid'" class="flex items-center gap-2">
              <input type="color" v-model="localWatermark.bgColor" @input="updateWatermark" class="w-6 h-6 rounded cursor-pointer border border-white/5" />
              <span class="text-[9px] font-bold uppercase tracking-wider text-on-surface">{{ localWatermark.bgColor }}</span>
            </div>
            <div v-if="localWatermark.bgColorMode === 'gradient'" class="space-y-1.5">
              <div class="flex items-center gap-2">
                <input type="color" v-model="localWatermark.bgGradientStart" @input="updateWatermark" class="w-6 h-6 rounded cursor-pointer border border-white/5" />
                <span class="text-[9px] text-on-surface-variant">Start</span>
                <input type="color" v-model="localWatermark.bgGradientEnd" @input="updateWatermark" class="w-6 h-6 rounded cursor-pointer border border-white/5" />
                <span class="text-[9px] text-on-surface-variant">End</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="text-[9px] text-on-surface-variant w-8 shrink-0">Angle</span>
                <input type="range" v-model.number="localWatermark.bgGradientAngle" @input="updateWatermark" min="0" max="360" step="5" class="flex-1 h-1 bg-surface-container-highest rounded-full appearance-none accent-primary" />
                <input type="number" v-model.number="localWatermark.bgGradientAngle" @change="updateWatermark" class="w-12 bg-surface-container border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface text-right focus:outline-none focus:border-primary" min="0" max="360" />
              </div>
            </div>
            <div v-if="localWatermark.bgColorMode === 'random'" class="flex items-center gap-2">
              <input type="color" v-model="localWatermark.bgRandomColorMin" @input="updateWatermark" class="w-6 h-6 rounded cursor-pointer border border-white/5" />
              <span class="text-[9px] text-on-surface-variant">Min</span>
              <input type="color" v-model="localWatermark.bgRandomColorMax" @input="updateWatermark" class="w-6 h-6 rounded cursor-pointer border border-white/5" />
              <span class="text-[9px] text-on-surface-variant">Max</span>
            </div>

            <!-- BG Opacity -->
            <div class="space-y-1">
              <label class="text-[9px] font-medium text-on-surface-variant">Opacity</label>
              <div class="flex items-center gap-1.5">
                <input type="range" v-model.number="localWatermark.bgOpacity" @input="updateWatermark" min="0" max="1" step="0.01" class="flex-1 h-1 bg-surface-container-highest rounded-full appearance-none accent-primary" />
                <input type="number" v-model.number="localWatermark.bgOpacity" @change="updateWatermark" class="w-14 bg-surface-container border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface text-right focus:outline-none focus:border-primary" min="0" max="1" step="0.01" />
              </div>
            </div>

            <!-- BG Padding with auto toggle -->
            <div class="space-y-1">
              <div class="flex items-center justify-between">
                <label class="text-[9px] font-medium text-on-surface-variant">Padding</label>
                <button
                  @click="localWatermark.bgPaddingAuto = !localWatermark.bgPaddingAuto; updateWatermark()"
                  class="ml-2 text-[8px] font-bold px-1.5 py-0.5 rounded transition-all flex-shrink-0"
                  :class="localWatermark.bgPaddingAuto ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'"
                  title="Toggle auto (relative to font size)"
                >auto</button>
              </div>
              <div v-if="!localWatermark.bgPaddingAuto" class="flex items-center gap-1.5">
                <input type="range" v-model.number="localWatermark.bgPadding" @input="updateWatermark" min="0" max="80" step="1" class="flex-1 h-1 bg-surface-container-highest rounded-full appearance-none accent-primary" />
                <input type="number" v-model.number="localWatermark.bgPadding" @change="updateWatermark" class="w-14 bg-surface-container border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface text-right focus:outline-none focus:border-primary" min="0" />
              </div>
              <div v-else class="flex items-center gap-1.5">
                <input type="range" v-model.number="localWatermark.bgPaddingMult" @input="updateWatermark" min="0" max="2" step="0.05" class="flex-1 h-1 bg-surface-container-highest rounded-full appearance-none accent-primary" />
                <input type="number" v-model.number="localWatermark.bgPaddingMult" @change="updateWatermark" class="w-14 bg-surface-container border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface text-right focus:outline-none focus:border-primary" min="0" step="0.05" />
              </div>
            </div>

            <!-- BG Radius with auto toggle -->
            <div class="space-y-1">
              <div class="flex items-center justify-between">
                <label class="text-[9px] font-medium text-on-surface-variant">Radius</label>
                <button
                  @click="localWatermark.bgRadiusAuto = !localWatermark.bgRadiusAuto; updateWatermark()"
                  class="ml-2 text-[8px] font-bold px-1.5 py-0.5 rounded transition-all flex-shrink-0"
                  :class="localWatermark.bgRadiusAuto ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'"
                  title="Toggle auto (relative to font size)"
                >auto</button>
              </div>
              <div v-if="!localWatermark.bgRadiusAuto" class="flex items-center gap-1.5">
                <input type="range" v-model.number="localWatermark.bgRadius" @input="updateWatermark" min="0" max="120" step="1" class="flex-1 h-1 bg-surface-container-highest rounded-full appearance-none accent-primary" />
                <input type="number" v-model.number="localWatermark.bgRadius" @change="updateWatermark" class="w-14 bg-surface-container border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface text-right focus:outline-none focus:border-primary" min="0" />
              </div>
              <div v-else class="flex items-center gap-1.5">
                <input type="range" v-model.number="localWatermark.bgRadiusMult" @input="updateWatermark" min="0" max="1" step="0.05" class="flex-1 h-1 bg-surface-container-highest rounded-full appearance-none accent-primary" />
                <input type="number" v-model.number="localWatermark.bgRadiusMult" @change="updateWatermark" class="w-14 bg-surface-container border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface text-right focus:outline-none focus:border-primary" min="0" step="0.05" />
              </div>
            </div>
          </div>
        </div>

        <!-- Border -->
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
              <div class="w-3 h-3 bg-white rounded-full shadow-md transform transition-transform" :class="localWatermark.borderEnabled ? 'translate-x-4' : 'translate-x-0.5'"></div>
            </button>
          </div>

          <div v-if="localWatermark.borderEnabled" class="space-y-2 pl-4">
            <!-- Border Color Mode -->
            <div class="flex gap-1 p-0.5 bg-surface-container rounded-md">
              <button v-for="m in colorModes" :key="m.value" @click="localWatermark.borderColorMode = m.value; updateWatermark()" class="flex-1 py-1 px-1 rounded text-[8px] font-bold uppercase tracking-wider transition-all" :class="localWatermark.borderColorMode === m.value ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'">{{ m.label }}</button>
            </div>
            <div v-if="localWatermark.borderColorMode === 'solid'" class="flex items-center gap-2">
              <input type="color" v-model="localWatermark.borderColor" @input="updateWatermark" class="w-6 h-6 rounded cursor-pointer border border-white/5" />
              <span class="text-[9px] font-bold uppercase tracking-wider text-on-surface">{{ localWatermark.borderColor }}</span>
            </div>
            <div v-if="localWatermark.borderColorMode === 'gradient'" class="space-y-1.5">
              <div class="flex items-center gap-2">
                <input type="color" v-model="localWatermark.borderGradientStart" @input="updateWatermark" class="w-6 h-6 rounded cursor-pointer border border-white/5" />
                <span class="text-[9px] text-on-surface-variant">Start</span>
                <input type="color" v-model="localWatermark.borderGradientEnd" @input="updateWatermark" class="w-6 h-6 rounded cursor-pointer border border-white/5" />
                <span class="text-[9px] text-on-surface-variant">End</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="text-[9px] text-on-surface-variant w-8 shrink-0">Angle</span>
                <input type="range" v-model.number="localWatermark.borderGradientAngle" @input="updateWatermark" min="0" max="360" step="5" class="flex-1 h-1 bg-surface-container-highest rounded-full appearance-none accent-primary" />
                <input type="number" v-model.number="localWatermark.borderGradientAngle" @change="updateWatermark" class="w-12 bg-surface-container border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface text-right focus:outline-none focus:border-primary" min="0" max="360" />
              </div>
            </div>
            <div v-if="localWatermark.borderColorMode === 'random'" class="flex items-center gap-2">
              <input type="color" v-model="localWatermark.borderRandomColorMin" @input="updateWatermark" class="w-6 h-6 rounded cursor-pointer border border-white/5" />
              <span class="text-[9px] text-on-surface-variant">Min</span>
              <input type="color" v-model="localWatermark.borderRandomColorMax" @input="updateWatermark" class="w-6 h-6 rounded cursor-pointer border border-white/5" />
              <span class="text-[9px] text-on-surface-variant">Max</span>
            </div>

            <!-- Border Width -->
            <div class="space-y-1">
              <label class="text-[9px] font-medium text-on-surface-variant">Width</label>
              <div class="flex items-center gap-1.5">
                <input type="range" v-model.number="localWatermark.borderWidth" @input="updateWatermark" min="0.5" max="30" step="0.5" class="flex-1 h-1 bg-surface-container-highest rounded-full appearance-none accent-primary" />
                <input type="number" v-model.number="localWatermark.borderWidth" @change="updateWatermark" class="w-14 bg-surface-container border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface text-right focus:outline-none focus:border-primary" min="0" step="0.5" />
              </div>
            </div>

            <!-- Border Opacity -->
            <div class="space-y-1">
              <label class="text-[9px] font-medium text-on-surface-variant">Opacity</label>
              <div class="flex items-center gap-1.5">
                <input type="range" v-model.number="localWatermark.borderOpacity" @input="updateWatermark" min="0" max="1" step="0.01" class="flex-1 h-1 bg-surface-container-highest rounded-full appearance-none accent-primary" />
                <input type="number" v-model.number="localWatermark.borderOpacity" @change="updateWatermark" class="w-14 bg-surface-container border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface text-right focus:outline-none focus:border-primary" min="0" max="1" step="0.01" />
              </div>
            </div>

            <!-- Border Style -->
            <div class="space-y-1">
              <label class="text-[9px] font-medium text-on-surface-variant">Style</label>
              <div class="grid grid-cols-4 gap-1">
                <button
                  v-for="style in borderStyles" :key="style.value"
                  @click="localWatermark.borderStyle = style.value; updateWatermark()"
                  class="py-1.5 px-1 rounded-lg text-[8px] font-bold uppercase tracking-wider transition-all border border-white/10"
                  :class="localWatermark.borderStyle === style.value ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-highest text-on-surface-variant hover:text-on-surface'"
                >{{ style.label }}</button>
              </div>
            </div>

            <!-- Border Radius -->
            <div class="space-y-1">
              <label class="text-[9px] font-medium text-on-surface-variant">Radius</label>
              <div class="flex items-center gap-1.5">
                <input type="range" v-model.number="localWatermark.borderRadius" @input="updateWatermark" min="0" max="120" step="1" class="flex-1 h-1 bg-surface-container-highest rounded-full appearance-none accent-primary" />
                <input type="number" v-model.number="localWatermark.borderRadius" @change="updateWatermark" class="w-14 bg-surface-container border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface text-right focus:outline-none focus:border-primary" min="0" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Repeat Pattern -->
    <div class="border border-white/5 rounded-xl overflow-hidden bg-surface-container-low/30">
      <button @click="toggleSection('pattern')" class="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-on-surface hover:bg-white/5 transition-all">
        <span class="flex items-center gap-2">
          <span class="material-symbols-outlined text-sm text-primary">grid_view</span>
          Repeat Pattern
        </span>
        <span class="material-symbols-outlined text-sm transition-transform" :class="{ 'rotate-180': openSections.pattern }">expand_more</span>
      </button>

      <div v-if="openSections.pattern" class="p-4 space-y-3 border-t border-white/5">
        <div class="flex items-center justify-between">
          <label class="text-[10px] font-medium text-on-surface-variant">Enable Pattern</label>
          <button
            @click="localWatermark.pattern = !localWatermark.pattern; updateWatermark()"
            class="w-8 h-4 rounded-full transition-all"
            :class="localWatermark.pattern ? 'bg-primary' : 'bg-surface-container-highest'"
          >
            <div class="w-3 h-3 bg-white rounded-full shadow-md transform transition-transform" :class="localWatermark.pattern ? 'translate-x-4' : 'translate-x-0.5'"></div>
          </button>
        </div>

        <div v-if="localWatermark.pattern" class="space-y-2">
          <!-- X Spacing -->
          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <label class="text-[9px] font-medium text-on-surface-variant">X Spacing</label>
              <select v-model="localWatermark.patternSpacingXUnit" @change="updateWatermark" class="bg-surface-container border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface focus:outline-none focus:border-primary">
                <option v-for="u in unitOptions" :key="u.value" :value="u.value">{{ u.label }}</option>
              </select>
            </div>
            <div class="flex items-center gap-1.5">
              <input type="range" v-model.number="localWatermark.patternSpacingX" @input="updateWatermark" min="0.5" max="20" step="0.1" class="flex-1 h-1 bg-surface-container-highest rounded-full appearance-none accent-primary" />
              <input type="number" v-model.number="localWatermark.patternSpacingX" @change="updateWatermark" class="w-14 bg-surface-container border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface text-right focus:outline-none focus:border-primary" min="0.1" step="0.1" />
            </div>
          </div>
          <!-- Y Spacing -->
          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <label class="text-[9px] font-medium text-on-surface-variant">Y Spacing</label>
              <select v-model="localWatermark.patternSpacingYUnit" @change="updateWatermark" class="bg-surface-container border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface focus:outline-none focus:border-primary">
                <option v-for="u in unitOptions" :key="u.value" :value="u.value">{{ u.label }}</option>
              </select>
            </div>
            <div class="flex items-center gap-1.5">
              <input type="range" v-model.number="localWatermark.patternSpacingY" @input="updateWatermark" min="0.5" max="20" step="0.1" class="flex-1 h-1 bg-surface-container-highest rounded-full appearance-none accent-primary" />
              <input type="number" v-model.number="localWatermark.patternSpacingY" @change="updateWatermark" class="w-14 bg-surface-container border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface text-right focus:outline-none focus:border-primary" min="0.1" step="0.1" />
            </div>
          </div>
          <!-- Gap Y (extra row spacing) -->
          <div class="space-y-1 pt-2 border-t border-white/5">
            <label class="text-[9px] font-medium text-on-surface-variant">Row Gap ×lh</label>
            <div class="flex items-center gap-1.5">
              <input type="range" v-model.number="localWatermark.patternGapY" @input="updateWatermark" min="0" max="10" step="0.1" class="flex-1 h-1 bg-surface-container-highest rounded-full appearance-none accent-primary" />
              <input type="number" v-model.number="localWatermark.patternGapY" @change="updateWatermark" class="w-14 bg-surface-container border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface text-right focus:outline-none focus:border-primary" min="0" step="0.1" />
            </div>
          </div>
          <!-- Row Offset -->
          <div class="space-y-1">
            <label class="text-[9px] font-medium text-on-surface-variant">Row Offset ×lh</label>
            <div class="flex items-center gap-1.5">
              <input type="range" v-model.number="localWatermark.patternOffset" @input="updateWatermark" min="0" max="10" step="0.1" class="flex-1 h-1 bg-surface-container-highest rounded-full appearance-none accent-primary" />
              <input type="number" v-model.number="localWatermark.patternOffset" @change="updateWatermark" class="w-14 bg-surface-container border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface text-right focus:outline-none focus:border-primary" min="0" step="0.1" />
            </div>
          </div>
          <!-- Random Offset -->
          <div class="flex items-center justify-between">
            <label class="text-[9px] font-medium text-on-surface-variant flex items-center gap-1">
              <span class="material-symbols-outlined text-xs">shuffle</span>Random Offset
            </label>
            <button @click="localWatermark.patternRandomOffset = !localWatermark.patternRandomOffset; updateWatermark()" class="w-8 h-4 rounded-full transition-all" :class="localWatermark.patternRandomOffset ? 'bg-primary' : 'bg-surface-container-highest'">
              <div class="w-3 h-3 bg-white rounded-full shadow-md transform transition-transform" :class="localWatermark.patternRandomOffset ? 'translate-x-4' : 'translate-x-0.5'"></div>
            </button>
          </div>
          <!-- Line Spacing -->
          <div class="space-y-1 pt-2 border-t border-white/5">
            <label class="text-[9px] font-medium text-on-surface-variant flex items-center gap-1">
              <span class="material-symbols-outlined text-xs">format_line_spacing</span>Line Spacing ×
            </label>
            <div class="flex items-center gap-1.5">
              <input type="range" v-model.number="localWatermark.lineHeightMultiplier" @input="updateWatermark" min="0.5" max="5" step="0.1" class="flex-1 h-1 bg-surface-container-highest rounded-full appearance-none accent-primary" />
              <input type="number" v-model.number="localWatermark.lineHeightMultiplier" @change="updateWatermark" class="w-14 bg-surface-container border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface text-right focus:outline-none focus:border-primary" min="0.1" step="0.1" />
            </div>
          </div>
          <!-- Pattern Rotation -->
          <div class="space-y-1 pt-2 border-t border-white/5">
            <label class="text-[9px] font-medium text-on-surface-variant flex items-center gap-1">
              <span class="material-symbols-outlined text-xs">rotate_right</span>Pattern Rotation °
            </label>
            <div class="flex items-center gap-1.5">
              <input type="range" v-model.number="localWatermark.patternRotation" @input="updateWatermark" min="-180" max="180" step="1" class="flex-1 h-1 bg-surface-container-highest rounded-full appearance-none accent-primary" />
              <input type="number" v-model.number="localWatermark.patternRotation" @change="updateWatermark" class="w-14 bg-surface-container border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface text-right focus:outline-none focus:border-primary" min="-360" max="360" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add to List Button -->
    <button
      @click="applyWatermark"
      class="w-full py-3 rounded-xl bg-primary hover:bg-primary-dim text-on-primary text-sm font-bold transition-all shadow-[0_0_20px_rgba(102,126,234,0.3)] hover:shadow-[0_0_30px_rgba(102,126,234,0.5)] flex items-center justify-center gap-2"
    >
      <span class="material-symbols-outlined text-sm">add_circle</span>
      Add to List
    </button>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({ watermark: { type: Object, required: true } })

const colorModes = [
  { value: 'solid', label: 'Solid' },
  { value: 'gradient', label: 'Grad' },
  { value: 'random', label: 'Rand' }
]
const borderStyles = [
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dash' },
  { value: 'dotted', label: 'Dot' },
  { value: 'double', label: 'Double' }
]
const unitOptions = [
  { value: 'lines', label: '×lh' },
  { value: 'em', label: 'em' },
  { value: 'px', label: 'px' }
]

const openSections = reactive({ basic: true, color: false, bg: false, pattern: false })
const toggleSection = (s) => { openSections[s] = !openSections[s] }

const localWatermark = reactive({
  text: 'Watermark', fontSize: 32, color: '#ffffff', opacity: 0.7, x: 50, y: 50,
  pattern: false, rotation: 0,
  colorMode: 'solid', gradientStart: '#667eea', gradientEnd: '#764ba2', gradientAngle: 45,
  randomColorMin: '#667eea', randomColorMax: '#764ba2', randomOpacityMin: 0.3, randomOpacityMax: 0.8,
  randomizeOpacity: false, opacityMin: 0.3, opacityMax: 0.8,
  randomizeSize: false, sizeMin: 16, sizeMax: 64,
  randomizeRotation: false, rotationMin: -30, rotationMax: 30,
  bgEnabled: false, bgColorMode: 'solid',
  bgColor: '#000000', bgGradientStart: '#333333', bgGradientEnd: '#000000', bgGradientAngle: 0,
  bgRandomColorMin: '#000000', bgRandomColorMax: '#333333',
  bgOpacity: 0.5, bgPadding: 10, bgPaddingAuto: false, bgPaddingMult: 0.3,
  bgRadius: 5, bgRadiusAuto: false, bgRadiusMult: 0.15,
  borderEnabled: false, borderColorMode: 'solid',
  borderColor: '#ffffff', borderGradientStart: '#ffffff', borderGradientEnd: '#cccccc', borderGradientAngle: 0,
  borderRandomColorMin: '#cccccc', borderRandomColorMax: '#ffffff',
  borderWidth: 2, borderOpacity: 1, borderStyle: 'solid', borderRadius: 0,
  patternSpacingX: 3, patternSpacingY: 2.5,
  patternSpacingXUnit: 'lines', patternSpacingYUnit: 'lines',
  patternOffset: 1.5, patternGapY: 0,
  patternRandomOffset: false, patternRotation: 0,
  lineHeightMultiplier: 1.5, textCutout: false,
  textStrokeEnabled: false, textStrokeColorMode: 'solid',
  textStrokeColor: '#000000', textStrokeGradientStart: '#000000', textStrokeGradientEnd: '#555555', textStrokeGradientAngle: 45,
  textStrokeRandomColorMin: '#000000', textStrokeRandomColorMax: '#555555',
  textStrokeWidth: 2, textStrokeOpacity: 1,
  ...props.watermark
})

watch(() => props.watermark, (v) => Object.assign(localWatermark, v), { deep: true })

const emit = defineEmits(['update:watermark', 'add-watermark'])

const savedOpacityBeforeCutout = ref(null)
const toggleCutout = () => {
  if (!localWatermark.textCutout) {
    savedOpacityBeforeCutout.value = localWatermark.opacity
    localWatermark.textCutout = true
    localWatermark.opacity = 0
  } else {
    localWatermark.textCutout = false
    if (savedOpacityBeforeCutout.value !== null) {
      localWatermark.opacity = savedOpacityBeforeCutout.value
      savedOpacityBeforeCutout.value = null
    }
  }
  updateWatermark()
}

const numFields = [
  'fontSize','opacity','x','y','rotation','gradientAngle',
  'randomOpacityMin','randomOpacityMax','opacityMin','opacityMax',
  'sizeMin','sizeMax','rotationMin','rotationMax',
  'bgOpacity','bgPadding','bgPaddingMult','bgRadius','bgRadiusMult','bgGradientAngle',
  'borderWidth','borderOpacity','borderRadius','borderGradientAngle',
  'patternSpacingX','patternSpacingY','patternOffset','patternGapY',
  'lineHeightMultiplier','patternRotation',
  'textStrokeWidth','textStrokeOpacity','textStrokeGradientAngle'
]

const updateWatermark = () => {
  numFields.forEach(f => { localWatermark[f] = Number(localWatermark[f]) || 0 })
  localWatermark.fontSize = localWatermark.fontSize || 32
  emit('update:watermark', { ...localWatermark })
}

const applyWatermark = () => {
  emit('update:watermark', { ...localWatermark })
  emit('add-watermark')
}
</script>
