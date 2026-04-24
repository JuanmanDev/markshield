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

      <div v-if="openSections.basic" class="p-4 space-y-4 border-t border-white/5">
        <!-- Font Size -->
        <div class="space-y-1.5">
          <label class="text-[10px] font-medium text-on-surface-variant flex items-center gap-1">
            <span class="material-symbols-outlined text-xs">format_size</span>
            Size
          </label>
          <div class="flex items-center gap-1.5">
            <input type="range" v-model.number="localWatermark.fontSize" @input="updateWatermark" min="8" max="300" step="1" class="flex-1 h-1 bg-surface-container rounded-full appearance-none accent-primary" />
            <input type="number" v-model.number="localWatermark.fontSize" @change="updateWatermark" class="w-16 bg-surface-container-highest border border-white/10 rounded px-1.5 py-0.5 text-[10px] text-on-surface text-right focus:outline-none focus:border-primary" min="1" />
          </div>
        </div>

        <!-- Rotation -->
        <div class="space-y-1.5">
          <label class="text-[10px] font-medium text-on-surface-variant flex items-center gap-1">
            <span class="material-symbols-outlined text-xs">rotate_right</span>
            Rotation
          </label>
          <div class="flex items-center gap-1.5">
            <input type="range" v-model.number="localWatermark.rotation" @input="updateWatermark" min="-180" max="180" step="1" class="flex-1 h-1 bg-surface-container rounded-full appearance-none accent-primary" />
            <input type="number" v-model.number="localWatermark.rotation" @change="updateWatermark" class="w-16 bg-surface-container-highest border border-white/10 rounded px-1.5 py-0.5 text-[10px] text-on-surface text-right focus:outline-none focus:border-primary" min="-360" max="360" />
          </div>
        </div>

        <!-- Opacity -->
        <div class="space-y-1.5">
          <label class="text-[10px] font-medium text-on-surface-variant flex items-center gap-1">
            <span class="material-symbols-outlined text-xs">opacity</span>
            Opacity
          </label>
          <div class="flex items-center gap-1.5">
            <input type="range" v-model.number="localWatermark.opacity" @input="updateWatermark" min="0" max="1" step="0.01" class="flex-1 h-1 bg-surface-container rounded-full appearance-none accent-primary" />
            <input type="number" v-model.number="localWatermark.opacity" @change="updateWatermark" class="w-16 bg-surface-container-highest border border-white/10 rounded px-1.5 py-0.5 text-[10px] text-on-surface text-right focus:outline-none focus:border-primary" min="0" max="1" step="0.01" />
          </div>
        </div>

        <!-- Position X & Y -->
        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1.5">
            <label class="text-[10px] font-medium text-on-surface-variant flex items-center gap-1">
              <span class="material-symbols-outlined text-xs">arrow_range</span>
              X pos
            </label>
            <div class="flex items-center gap-1">
              <input type="range" v-model.number="localWatermark.x" @input="updateWatermark" min="0" max="100" step="0.5" class="flex-1 h-1 bg-surface-container rounded-full appearance-none accent-primary" />
              <input type="number" v-model.number="localWatermark.x" @change="updateWatermark" class="w-14 bg-surface-container-highest border border-white/10 rounded px-1 py-0.5 text-[10px] text-on-surface text-right focus:outline-none focus:border-primary" min="0" max="100" step="0.5" />
            </div>
          </div>
          <div class="space-y-1.5">
            <label class="text-[10px] font-medium text-on-surface-variant flex items-center gap-1">
              <span class="material-symbols-outlined text-xs">vertical_align_center</span>
              Y pos
            </label>
            <div class="flex items-center gap-1">
              <input type="range" v-model.number="localWatermark.y" @input="updateWatermark" min="0" max="100" step="0.5" class="flex-1 h-1 bg-surface-container rounded-full appearance-none accent-primary" />
              <input type="number" v-model.number="localWatermark.y" @change="updateWatermark" class="w-14 bg-surface-container-highest border border-white/10 rounded px-1 py-0.5 text-[10px] text-on-surface text-right focus:outline-none focus:border-primary" min="0" max="100" step="0.5" />
            </div>
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
              Cutout Text (inverted mark)
            </label>
            <button
              @click="localWatermark.textCutout = !localWatermark.textCutout; updateWatermark()"
              class="w-8 h-4 rounded-full transition-all"
              :class="localWatermark.textCutout ? 'bg-primary' : 'bg-surface-container-highest'"
            >
              <div class="w-3 h-3 bg-white rounded-full shadow-md transform transition-transform" :class="localWatermark.textCutout ? 'translate-x-4' : 'translate-x-0.5'"></div>
            </button>
          </div>
          <p v-if="localWatermark.textCutout" class="text-[9px] text-on-surface-variant/60 mt-1">Requires Background enabled. Text is punched out of the background.</p>
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
            <div class="flex items-center gap-2">
              <input type="color" v-model="localWatermark.bgColor" @input="updateWatermark" class="w-6 h-6 rounded cursor-pointer border border-white/5" />
              <span class="text-[9px] text-on-surface-variant">Color</span>
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
            <div class="flex items-center gap-2">
              <input type="color" v-model="localWatermark.borderColor" @input="updateWatermark" class="w-6 h-6 rounded cursor-pointer border border-white/5" />
              <span class="text-[9px] text-on-surface-variant">Color</span>
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

        <div v-if="localWatermark.pattern" class="space-y-3">
          <!-- X and Y Spacing -->
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <div class="flex items-center justify-between">
                <label class="text-[9px] font-medium text-on-surface-variant">X Spacing</label>
                <select v-model="localWatermark.patternSpacingXUnit" @change="updateWatermark" class="bg-surface-container border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface focus:outline-none focus:border-primary">
                  <option value="lines">×lh</option>
                  <option value="em">em</option>
                  <option value="px">px</option>
                </select>
              </div>
              <div class="flex items-center gap-1">
                <input type="range" v-model.number="localWatermark.patternSpacingX" @input="updateWatermark" min="0.5" max="20" step="0.1" class="flex-1 h-1 bg-surface-container-highest rounded-full appearance-none accent-primary" />
                <input type="number" v-model.number="localWatermark.patternSpacingX" @change="updateWatermark" class="w-12 bg-surface-container border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface text-right focus:outline-none focus:border-primary" min="0.1" step="0.1" />
              </div>
            </div>
            <div class="space-y-1">
              <div class="flex items-center justify-between">
                <label class="text-[9px] font-medium text-on-surface-variant">Y Spacing</label>
                <select v-model="localWatermark.patternSpacingYUnit" @change="updateWatermark" class="bg-surface-container border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface focus:outline-none focus:border-primary">
                  <option value="lines">×lh</option>
                  <option value="em">em</option>
                  <option value="px">px</option>
                </select>
              </div>
              <div class="flex items-center gap-1">
                <input type="range" v-model.number="localWatermark.patternSpacingY" @input="updateWatermark" min="0.5" max="20" step="0.1" class="flex-1 h-1 bg-surface-container-highest rounded-full appearance-none accent-primary" />
                <input type="number" v-model.number="localWatermark.patternSpacingY" @change="updateWatermark" class="w-12 bg-surface-container border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface text-right focus:outline-none focus:border-primary" min="0.1" step="0.1" />
              </div>
            </div>
          </div>

          <!-- Gap Top / Bottom (extra spacing per row) -->
          <div class="grid grid-cols-2 gap-3 pt-1 border-t border-white/5">
            <div class="space-y-1.5">
              <label class="text-[9px] font-medium text-on-surface-variant">Gap Top</label>
              <div class="flex items-center gap-1">
                <input type="range" v-model.number="localWatermark.patternGapTop" @input="updateWatermark" min="0" max="5" step="0.1" class="flex-1 h-1 bg-surface-container-highest rounded-full appearance-none accent-primary" />
                <input type="number" v-model.number="localWatermark.patternGapTop" @change="updateWatermark" class="w-12 bg-surface-container border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface text-right focus:outline-none focus:border-primary" min="0" step="0.1" />
              </div>
            </div>
            <div class="space-y-1.5">
              <label class="text-[9px] font-medium text-on-surface-variant">Gap Bottom</label>
              <div class="flex items-center gap-1">
                <input type="range" v-model.number="localWatermark.patternGapBottom" @input="updateWatermark" min="0" max="5" step="0.1" class="flex-1 h-1 bg-surface-container-highest rounded-full appearance-none accent-primary" />
                <input type="number" v-model.number="localWatermark.patternGapBottom" @change="updateWatermark" class="w-12 bg-surface-container border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface text-right focus:outline-none focus:border-primary" min="0" step="0.1" />
              </div>
            </div>
          </div>

          <!-- Row Offset -->
          <div class="space-y-1.5">
            <label class="text-[9px] font-medium text-on-surface-variant">Row Offset</label>
            <div class="flex items-center gap-1.5">
              <input type="range" v-model.number="localWatermark.patternOffset" @input="updateWatermark" min="0" max="10" step="0.1" class="flex-1 h-1 bg-surface-container-highest rounded-full appearance-none accent-primary" />
              <input type="number" v-model.number="localWatermark.patternOffset" @change="updateWatermark" class="w-14 bg-surface-container border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface text-right focus:outline-none focus:border-primary" min="0" step="0.1" />
            </div>
          </div>

          <!-- Random Offset -->
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
              <div class="w-3 h-3 bg-white rounded-full shadow-md transform transition-transform" :class="localWatermark.patternRandomOffset ? 'translate-x-4' : 'translate-x-0.5'"></div>
            </button>
          </div>

          <!-- Line Height Multiplier -->
          <div class="space-y-1.5 pt-3 border-t border-white/5">
            <label class="text-[9px] font-medium text-on-surface-variant flex items-center gap-1">
              <span class="material-symbols-outlined text-xs">format_line_spacing</span>
              Line Spacing
            </label>
            <div class="flex items-center gap-1.5">
              <input type="range" v-model.number="localWatermark.lineHeightMultiplier" @input="updateWatermark" min="0.5" max="5" step="0.1" class="flex-1 h-1 bg-surface-container-highest rounded-full appearance-none accent-primary" />
              <input type="number" v-model.number="localWatermark.lineHeightMultiplier" @change="updateWatermark" class="w-14 bg-surface-container border border-white/10 rounded px-1 py-0.5 text-[9px] text-on-surface text-right focus:outline-none focus:border-primary" min="0.1" step="0.1" />
            </div>
          </div>

          <!-- Pattern Rotation -->
          <div class="space-y-1.5 pt-3 border-t border-white/5">
            <label class="text-[9px] font-medium text-on-surface-variant flex items-center gap-1">
              <span class="material-symbols-outlined text-xs">rotate_right</span>
              Pattern Rotation
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
  { value: 'dashed', label: 'Dash' },
  { value: 'dotted', label: 'Dot' },
  { value: 'double', label: 'Double' }
]

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
  bgPaddingAuto: false,
  bgPaddingMult: 0.3,
  bgRadius: 5,
  bgRadiusAuto: false,
  bgRadiusMult: 0.15,
  borderEnabled: false,
  borderColor: '#ffffff',
  borderWidth: 2,
  borderOpacity: 1,
  borderStyle: 'solid',
  borderRadius: 0,
  patternSpacingX: 3,
  patternSpacingY: 2.5,
  patternSpacingXUnit: 'lines',
  patternSpacingYUnit: 'lines',
  patternOffset: 1.5,
  patternGapTop: 0,
  patternGapBottom: 0,
  patternRandomOffset: false,
  patternRotation: 0,
  lineHeightMultiplier: 1.5,
  textCutout: false,
  ...props.watermark
})

watch(() => props.watermark, (newVal) => {
  Object.assign(localWatermark, newVal)
}, { deep: true })

const emit = defineEmits(['update:watermark', 'add-watermark'])

const updateWatermark = () => {
  localWatermark.fontSize = Number(localWatermark.fontSize) || 32
  localWatermark.opacity = Number(localWatermark.opacity)
  localWatermark.x = Number(localWatermark.x)
  localWatermark.y = Number(localWatermark.y)
  localWatermark.rotation = Number(localWatermark.rotation)
  localWatermark.gradientAngle = Number(localWatermark.gradientAngle)
  localWatermark.randomOpacityMin = Number(localWatermark.randomOpacityMin)
  localWatermark.randomOpacityMax = Number(localWatermark.randomOpacityMax)
  localWatermark.bgOpacity = Number(localWatermark.bgOpacity)
  localWatermark.bgPadding = Number(localWatermark.bgPadding)
  localWatermark.bgPaddingMult = Number(localWatermark.bgPaddingMult)
  localWatermark.bgRadius = Number(localWatermark.bgRadius)
  localWatermark.bgRadiusMult = Number(localWatermark.bgRadiusMult)
  localWatermark.borderWidth = Number(localWatermark.borderWidth)
  localWatermark.borderOpacity = Number(localWatermark.borderOpacity)
  localWatermark.borderRadius = Number(localWatermark.borderRadius)
  localWatermark.patternSpacingX = Number(localWatermark.patternSpacingX)
  localWatermark.patternSpacingY = Number(localWatermark.patternSpacingY)
  localWatermark.patternOffset = Number(localWatermark.patternOffset)
  localWatermark.patternGapTop = Number(localWatermark.patternGapTop)
  localWatermark.patternGapBottom = Number(localWatermark.patternGapBottom)
  localWatermark.lineHeightMultiplier = Number(localWatermark.lineHeightMultiplier)
  localWatermark.patternRotation = Number(localWatermark.patternRotation)

  emit('update:watermark', { ...localWatermark })
}

const applyWatermark = () => {
  emit('update:watermark', { ...localWatermark })
  emit('add-watermark')
}
</script>
