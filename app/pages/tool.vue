<template>
  <div class="bg-background text-on-surface font-body h-screen w-screen overflow-hidden relative">
    <!-- TopNavBar -->
    <header class="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-3 md:px-8 h-12 md:h-16 bg-[#060e20]/60 backdrop-blur-xl border-b border-white/5 shadow-[0_20px_50px_rgba(139,92,246,0.1)]">
      <NuxtLink to="/" class="flex items-center gap-2 md:gap-8 group">
        <span class="text-base md:text-2xl font-black tracking-tighter text-violet-400 group-hover:text-violet-300 transition-colors uppercase whitespace-nowrap tracking-tightest leading-none">
          MarkShield
        </span>
      </NuxtLink>

      <div class="flex items-center gap-1 md:gap-4">
        <!-- Undo/Redo -->
        <div class="flex items-center gap-0.5 md:gap-1 bg-white/5 rounded-lg p-0.5 md:p-1">
          <button
            class="p-1 md:p-1.5 hover:bg-white/10 rounded-md transition-all text-slate-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
            :disabled="!canUndo"
            @click="undo"
            title="Undo"
          >
            <span class="material-symbols-outlined text-base md:text-lg">undo</span>
          </button>
          <button
            class="p-1 md:p-1.5 hover:bg-white/10 rounded-md transition-all text-slate-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
            :disabled="!canRedo"
            @click="redo"
            title="Redo"
          >
            <span class="material-symbols-outlined text-base md:text-lg">redo</span>
          </button>
        </div>

        <!-- Language Toggle (Always visible) -->
        <button
          class="p-1 md:p-2 hover:bg-white/5 rounded-lg transition-all text-slate-400 hover:text-primary"
          @click="toggleLanguage"
        >
          <span class="material-symbols-outlined text-base md:text-lg">language</span>
        </button>

        <!-- Desktop Only Buttons -->
        <div class="hidden md:flex items-center gap-2">
          <button class="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-all" @click="resetAllAndClear">{{ t('actions.reset') }}</button>
          
          <!-- PDF Page Navigation (if PDF) -->
          <div v-if="currentPdfPages > 1" class="flex items-center gap-1 bg-white/5 rounded-lg px-2 py-1">
            <button 
              @click="currentPdfPage = Math.max(1, currentPdfPage - 1)"
              :disabled="currentPdfPage <= 1"
              class="p-1 hover:bg-white/10 rounded disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span class="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <span class="text-xs font-bold text-primary min-w-[60px] text-center">Page {{ currentPdfPage }}/{{ currentPdfPages }}</span>
            <button 
              @click="currentPdfPage = Math.min(currentPdfPages, currentPdfPage + 1)"
              :disabled="currentPdfPage >= currentPdfPages"
              class="p-1 hover:bg-white/10 rounded disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span class="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
          
          <!-- Save Button with Format Selector -->
          <div class="relative" ref="saveButtonRef">
            <button 
              @click="showSaveDropdown = !showSaveDropdown"
              class="px-5 py-2 text-sm font-bold border border-white/10 hover:bg-white/5 text-slate-200 rounded-lg shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
              :disabled="!selectedImages.length"
            >
              <span class="material-symbols-outlined text-sm">save</span>
              Save
              <span class="material-symbols-outlined text-sm">expand_more</span>
            </button>
            
            <!-- Save Dropdown -->
            <div
              v-if="showSaveDropdown"
              class="absolute top-full right-0 mt-2 w-52 bg-[#0a1628] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <!-- Scope tabs -->
              <div class="p-2 border-b border-white/5">
                <div class="flex gap-1 p-0.5 bg-surface-container rounded-lg">
                  <button
                    @click="saveExportScope = 'current'"
                    class="flex-1 py-1 px-1.5 rounded text-[9px] font-bold transition-all"
                    :class="saveExportScope === 'current' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'"
                  >Current</button>
                  <button
                    @click="saveExportScope = 'all'"
                    class="flex-1 py-1 px-1.5 rounded text-[9px] font-bold transition-all"
                    :class="saveExportScope === 'all' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'"
                  >All ({{ selectedImages.length }})</button>
                </div>
              </div>
              <div class="p-2 border-b border-white/5">
                <p class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Export Format</p>
                <div class="grid grid-cols-3 gap-1">
                  <button
                    v-for="fmt in currentExportFormats"
                    :key="fmt.value"
                    @click="exportFormat = fmt.value"
                    class="py-1.5 px-2 rounded text-[9px] font-bold uppercase transition-all border"
                    :class="exportFormat === fmt.value
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-container-highest text-on-surface-variant border-white/10 hover:border-white/20'"
                  >
                    {{ fmt.label }}
                  </button>
                </div>
              </div>
              <div v-if="exportFormat === 'jpg' || exportFormat === 'webp' || exportFormat === 'avif'" class="p-2 border-b border-white/5">
                <label class="text-[10px] font-medium text-on-surface-variant flex justify-between mb-1">
                  Quality
                  <span class="text-primary font-bold">{{ exportQuality }}%</span>
                </label>
                <input
                  type="range"
                  v-model="exportQuality"
                  min="50" max="100" step="5"
                  class="w-full h-1 bg-surface-container rounded-full appearance-none accent-primary"
                />
              </div>
              <button
                @click="exportImage(saveExportScope === 'all'); showSaveDropdown = false"
                class="w-full py-2.5 px-3 text-xs font-bold bg-primary hover:bg-primary-dim text-on-primary transition-all flex items-center justify-center gap-1.5"
              >
                <span class="material-symbols-outlined text-sm">download</span>
                Export {{ saveExportScope === 'all' ? 'All' : (hasPdfFiles ? 'PDF' : 'Image') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Desktop Sidebar (Right side) -->
    <aside v-if="selectedImages.length > 0" class="hidden md:flex fixed right-0 top-16 bottom-0 w-80 bg-[#060e20]/80 backdrop-blur-2xl border-l border-white/5 z-40 flex-col">
      <div class="p-6 flex-1 overflow-y-auto space-y-8">
        <WatermarkManager
          :watermarks="watermarks"
          @add-watermark="addWatermark"
          @update-watermark="handleEditWatermark"
          @remove-watermark="removeWatermark"
          @apply-watermarks="applyWatermarks"
        />
        <WatermarkConfig
          :watermark="currentWatermark"
          @update:watermark="handleWatermarkUpdate"
          @add-watermark="addWatermark"
        />
      </div>
    </aside>

    <!-- Empty State - Desktop -->
    <div v-if="selectedImages.length === 0" class="hidden md:flex fixed left-0 right-0 top-16 bottom-0 items-center justify-center bg-surface">
      <div class="text-center">
        <div class="w-32 h-32 rounded-3xl bg-surface-container flex items-center justify-center mb-6 shadow-inner mx-auto">
          <span class="material-symbols-outlined text-6xl text-on-surface/30">add_photo_alternate</span>
        </div>
        <p class="text-sm font-black tracking-widest uppercase text-on-surface/40 mb-2">No files uploaded yet</p>
        <p class="text-xs text-on-surface-variant/30 mb-6">Upload an image or PDF to start editing</p>
        <button 
          @click="triggerFileInput"
          class="px-8 py-3 text-sm font-bold bg-primary text-on-primary rounded-xl shadow-lg hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 mx-auto"
        >
          <span class="material-symbols-outlined text-lg">upload_file</span>
          Upload Files
        </button>
      </div>
    </div>

    <!-- Main Content Area - Desktop Layout -->
    <main v-if="selectedImages.length > 0" class="hidden md:flex fixed left-0 right-80 top-16 bottom-0 flex-col bg-surface overflow-hidden">
      <!-- Preview Area -->
      <div class="flex-1 relative overflow-hidden flex items-center justify-center p-8 lg:p-12">
        <!-- Prev / Next nav -->
        <button
          v-if="selectedImages.length > 1"
          class="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 bg-[#192540]/80 backdrop-blur-md rounded-xl border border-white/10 hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          :disabled="currentImageIndex === 0"
          @click="goToPrevImage"
          title="Previous (←)"
        >
          <span class="material-symbols-outlined text-xl">chevron_left</span>
        </button>
        <WatermarkPreview
          :images="selectedImages"
          :watermarks="watermarks"
          :current-watermark="currentWatermark"
          :is-processing="isProcessing"
          :current-image-index="currentImageIndex"
          :pdf-page="currentPdfPage"
          @trigger-upload="triggerFileInput"
        />
        <button
          v-if="selectedImages.length > 1"
          class="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 bg-[#192540]/80 backdrop-blur-md rounded-xl border border-white/10 hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          :disabled="currentImageIndex >= selectedImages.length - 1"
          @click="goToNextImage"
          title="Next (→)"
        >
          <span class="material-symbols-outlined text-xl">chevron_right</span>
        </button>
      </div>

      <!-- Gallery strip (thumbnail selector) -->
      <div v-if="selectedImages.length > 0" class="bg-surface-container-low/30 border-t border-white/5">
        <ImageGallery
          :images="selectedImages"
          :model-value="currentImageIndex"
          @update:model-value="currentImageIndex = $event"
          @remove-image="handleRemoveImage"
          @add-more="triggerFileInput"
        />
      </div>

      <!-- Action Footer / Suggestions Bar -->
      <div class="h-44 bg-surface-container-low/30 border-t border-white/5 flex flex-col overflow-hidden">
        <div class="px-4 py-2 border-b border-white/5 flex items-center justify-between shrink-0">
          <h4 class="text-[10px] font-black tracking-tightest uppercase text-on-surface-variant flex items-center gap-2">
            <span class="material-symbols-outlined text-sm text-primary">auto_fix_high</span>
            Smart Suggestions
          </h4>
          <div class="flex items-center gap-1">
            <button
              @click="saveCurrentAsPresetManual"
              class="p-1 hover:bg-white/10 rounded-lg transition-all text-on-surface-variant hover:text-primary"
              title="Save current config as preset (also logs to console)"
            >
              <span class="material-symbols-outlined text-base">bookmark_add</span>
            </button>
            <div class="w-px h-4 bg-white/10 mx-0.5"></div>
            <button @click="scrollSuggestions(-1)" class="p-1 hover:bg-white/10 rounded-lg transition-all text-on-surface-variant hover:text-on-surface">
              <span class="material-symbols-outlined text-base">chevron_left</span>
            </button>
            <button @click="scrollSuggestions(1)" class="p-1 hover:bg-white/10 rounded-lg transition-all text-on-surface-variant hover:text-on-surface">
              <span class="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </div>
        </div>

        <div ref="suggestionsCarouselRef" class="flex-1 overflow-x-auto px-4 py-2 scrollbar-hide">
          <div class="flex items-center gap-2 h-full">
            <button
              v-for="sug in visibleSuggestions"
              :key="sug.id"
              class="flex-shrink-0 w-28 h-full rounded-lg bg-surface-container hover:bg-surface-container-high border border-white/[0.06] hover:border-primary/30 transition-all group flex flex-col p-1.5 text-left relative overflow-hidden"
              @click="applySuggestion(sug)"
            >
              <div class="w-full flex-1 rounded-md bg-black/30 mb-1.5 overflow-hidden relative group-hover:scale-[1.02] transition-transform">
                <img v-if="currentImagePreview" :src="currentImagePreview" class="absolute inset-0 w-full h-full object-cover" />
                <div v-else class="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-indigo-500/20"></div>
                <!-- overlay tint so text is always readable -->
                <div class="absolute inset-0 bg-black/20"></div>
                <div
                  class="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
                  :style="{ transform: `rotate(${sug.rotation || 0}deg)` }"
                >
                  <span
                    class="font-black text-center leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] px-1"
                    :style="{ color: sug.color, fontSize: Math.min(9, sug.size / 5) + 'px', opacity: Math.max(sug.opacity, 0.85) }"
                  >{{ sug.text }}</span>
                </div>
              </div>
              <p class="text-[9px] font-bold truncate leading-none">{{ sug.label }}</p>
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Mobile Layout - Preview on Top, Controls on Bottom -->
    <div class="md:hidden fixed inset-0 top-12 bottom-0 flex flex-col bg-surface">
      <!-- Preview Area (Top 45%) -->
      <div 
        class="relative flex-shrink-0 bg-black transition-all duration-300"
        :style="{ height: previewHeight + 'vh' }"
      >
        <!-- Mobile image nav overlay -->
        <div v-if="selectedImages.length > 1" class="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-[#192540]/80 backdrop-blur-md rounded-xl border border-white/10 px-2 py-1">
          <button class="p-1 hover:bg-white/10 rounded-lg disabled:opacity-30" :disabled="currentImageIndex === 0" @click="goToPrevImage">
            <span class="material-symbols-outlined text-base">chevron_left</span>
          </button>
          <span class="text-[10px] font-bold text-on-surface min-w-[40px] text-center">{{ currentImageIndex + 1 }} / {{ selectedImages.length }}</span>
          <button class="p-1 hover:bg-white/10 rounded-lg disabled:opacity-30" :disabled="currentImageIndex >= selectedImages.length - 1" @click="goToNextImage">
            <span class="material-symbols-outlined text-base">chevron_right</span>
          </button>
        </div>
        <WatermarkPreview
          :images="selectedImages"
          :watermarks="watermarks"
          :current-watermark="currentWatermark"
          :is-processing="isProcessing"
          :current-image-index="currentImageIndex"
          :pdf-page="currentPdfPage"
          @trigger-upload="triggerFileInput"
        />
      </div>

      <!-- Controls Area (Bottom) -->
      <div 
        class="flex-1 flex flex-col overflow-hidden"
        :style="{ height: controlsHeight + 'vh' }"
      >
        <!-- Tab Navigation (Compact) -->
        <div 
          class="flex-shrink-0 bg-surface-container-low/30 border-b border-white/5 transition-all duration-300"
          :class="{ 'py-1': tabsCollapsed, 'py-2': !tabsCollapsed }"
        >
          <div class="flex">
            <button
              v-for="tab in mobileTabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="flex-1 transition-all border-b-2"
              :class="[
                tabsCollapsed ? 'py-1.5 px-1' : 'py-2 px-2',
                activeTab === tab.id 
                  ? 'border-primary text-primary bg-primary/5' 
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              ]"
            >
              <span 
                class="material-symbols-outlined block mx-auto transition-all"
                :class="tabsCollapsed ? 'text-lg' : 'text-base mb-0.5'"
              >{{ tab.icon }}</span>
              <span 
                v-if="!tabsCollapsed"
                class="text-[9px] font-bold uppercase tracking-wider block"
              >{{ tab.label }}</span>
            </button>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="flex-1 overflow-y-auto" @scroll="handleScroll">
          <!-- Files Tab -->
          <div v-show="activeTab === 'files'" class="p-2">
            <ImageUploader ref="uploaderRef" @images-uploaded="handleImagesUploaded" />
            <div v-if="selectedImages.length > 0" class="mt-2">
              <button
                @click="resetAllAndClear"
                class="w-full py-2 px-3 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-all flex items-center justify-center gap-1.5"
              >
                <span class="material-symbols-outlined text-sm">refresh</span>
                Reset All
              </button>
            </div>
          </div>

          <!-- Presets Tab -->
          <div v-if="activeTab === 'presets'" class="space-y-3">
            <!-- Gallery strip in presets tab -->
            <div v-if="selectedImages.length > 0" class="border-b border-white/5">
              <ImageGallery
                :images="selectedImages"
                :model-value="currentImageIndex"
                @update:model-value="currentImageIndex = $event"
                @remove-image="handleRemoveImage"
                @add-more="triggerFileInput"
              />
            </div>
            <div class="p-2 space-y-3">
            <!-- Business name -->
            <div class="flex items-center gap-2 px-1">
              <span class="text-[10px] text-on-surface-variant font-bold">Business:</span>
              <input
                v-model="businessName"
                class="flex-1 text-[10px] bg-white/5 border border-white/10 rounded px-2 py-1 text-on-surface focus:outline-none focus:border-primary/50"
                placeholder="Hostal Zamora"
              />
            </div>
            <!-- Saved Presets Section -->
            <div v-if="savedPresets.length > 0">
              <div class="flex items-center justify-between mb-2 px-1">
                <h4 class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Saved Presets</h4>
                <button 
                  @click="saveCurrentAsPreset"
                  class="text-[10px] font-bold text-primary flex items-center gap-1"
                >
                  <span class="material-symbols-outlined text-xs">add_circle</span>
                  Save Current
                </button>
              </div>
              <div class="grid grid-cols-3 gap-1.5 mb-3">
                <button
                  v-for="preset in savedPresets"
                  :key="preset.id"
                  class="rounded-lg bg-surface-container hover:bg-surface-container-high border border-white/[0.06] hover:border-primary/30 transition-all group flex flex-col p-1.5 text-left relative overflow-hidden"
                  @click="applySuggestion(preset)"
                >
                  <!-- Delete button -->
                  <div
                    role="button"
                    tabindex="0"
                    @click="deleteSavedPreset(preset.id, $event)"
                    @keydown.enter="deleteSavedPreset(preset.id, $event)"
                    @keydown.space.prevent="deleteSavedPreset(preset.id, $event)"
                    class="absolute top-0.5 right-0.5 w-4 h-4 bg-black/70 rounded-full flex items-center justify-center text-white/60 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
                  >
                    <span class="material-symbols-outlined text-[10px]">close</span>
                  </div>

                  <div class="w-full h-16 rounded-md bg-black/30 mb-1 overflow-hidden relative">
                    <img v-if="currentImagePreview" :src="currentImagePreview" class="absolute inset-0 w-full h-full object-cover" />
                    <div v-else class="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-indigo-500/20"></div>
                    <div class="absolute inset-0 bg-black/20"></div>
                    <div
                      class="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
                      :style="{ transform: `rotate(${preset.rotation || 0}deg)` }"
                    >
                      <span
                        class="font-black text-center leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] px-0.5"
                        :style="{ color: preset.color || '#ffffff', fontSize: Math.min(8, (preset.fontSize || preset.size || 32) / 5) + 'px', opacity: Math.max(preset.opacity || 0.7, 0.85) }"
                      >{{ preset.text }}</span>
                    </div>
                  </div>
                  <p class="text-[8px] font-bold truncate leading-none">{{ preset.label }}</p>
                </button>
              </div>
            </div>

            <!-- Default Presets Section -->
            <div>
              <h4 class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 px-1">Default Presets</h4>
              <div class="grid grid-cols-3 gap-1.5">
                <button
                  v-for="sug in visibleSuggestions"
                  :key="sug.id"
                  class="rounded-lg bg-surface-container hover:bg-surface-container-high border border-white/[0.06] hover:border-primary/30 transition-all group flex flex-col p-1.5 text-left relative overflow-hidden"
                  @click="applySuggestion(sug)"
                >
                  <div class="w-full h-16 rounded-md bg-black/30 mb-1 overflow-hidden relative">
                    <img v-if="currentImagePreview" :src="currentImagePreview" class="absolute inset-0 w-full h-full object-cover" />
                    <div v-else class="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-indigo-500/20"></div>
                    <div class="absolute inset-0 bg-black/20"></div>
                    <div
                      class="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
                      :style="{ transform: `rotate(${sug.rotation || 0}deg)` }"
                    >
                      <span
                        class="font-black text-center leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] px-0.5"
                        :style="{ color: sug.color, fontSize: Math.min(8, sug.size / 5) + 'px', opacity: Math.max(sug.opacity, 0.85) }"
                      >{{ sug.text }}</span>
                    </div>
                  </div>
                  <p class="text-[8px] font-bold truncate leading-none">{{ sug.label }}</p>
                </button>
              </div>
            </div>
            </div><!-- end inner p-2 -->
          </div>

          <!-- Config Tab -->
          <div v-if="activeTab === 'config'" class="p-2">
            <WatermarkConfig
              :watermark="currentWatermark"
              @update:watermark="handleWatermarkUpdate"
            />
          </div>

          <!-- Manager Tab -->
          <div v-if="activeTab === 'manager'" class="p-2">
            <WatermarkManager
              :watermarks="watermarks"
              @add-watermark="addWatermark"
              @update-watermark="handleEditWatermark"
              @remove-watermark="removeWatermark"
              @apply-watermarks="applyWatermarks"
            />
          </div>

          <!-- Save Tab -->
          <div v-if="activeTab === 'save'" class="p-2 space-y-3">
            <div class="p-3 bg-surface-container rounded-lg space-y-3">
              <!-- Scope Tab Selector -->
              <div class="flex gap-1 p-0.5 bg-surface-container-highest rounded-lg">
                <button
                  @click="saveExportScope = 'current'"
                  class="flex-1 py-1.5 rounded-md text-[10px] font-bold transition-all"
                  :class="saveExportScope === 'current' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'"
                >Current Image</button>
                <button
                  @click="saveExportScope = 'all'"
                  class="flex-1 py-1.5 rounded-md text-[10px] font-bold transition-all"
                  :class="saveExportScope === 'all' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'"
                >All ({{ selectedImages.length }})</button>
              </div>

              <!-- PDF Detection -->
              <div v-if="hasPdfFiles" class="p-2 bg-primary/10 border border-primary/20 rounded-lg">
                <p class="text-[10px] text-primary font-bold flex items-center gap-1">
                  <span class="material-symbols-outlined text-xs">picture_as_pdf</span>
                  PDF detected - Will export as PDF
                </p>
              </div>

              <!-- Format Selection -->
              <div class="space-y-2">
                <label class="text-[10px] font-medium text-on-surface-variant">Format</label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="fmt in currentExportFormats"
                    :key="fmt.value"
                    @click="exportFormat = fmt.value"
                    class="py-2 px-2 rounded-lg text-[9px] font-bold uppercase transition-all border"
                    :class="exportFormat === fmt.value
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-container-highest text-on-surface-variant border-white/10 hover:border-white/20'"
                  >
                    {{ fmt.label }}
                  </button>
                </div>
              </div>

              <!-- Quality Slider (for lossy formats) -->
              <div v-if="exportFormat === 'jpg' || exportFormat === 'webp' || exportFormat === 'avif'" class="space-y-2">
                <label class="text-[10px] font-medium text-on-surface-variant flex justify-between">
                  Quality
                  <span class="text-primary font-bold">{{ exportQuality }}%</span>
                </label>
                <input
                  type="range"
                  v-model="exportQuality"
                  min="50" max="100" step="5"
                  class="w-full h-1 bg-surface-container rounded-full appearance-none accent-primary"
                />
              </div>

              <!-- Size Limit -->
              <div class="space-y-2">
                <label class="text-[10px] font-medium text-on-surface-variant flex justify-between">
                  Max Size (0 = original)
                  <span class="text-primary font-bold">{{ maxExportSize > 0 ? maxExportSize + 'px' : 'Original' }}</span>
                </label>
                <input
                  type="range"
                  v-model="maxExportSize"
                  min="0" max="4096" step="256"
                  class="w-full h-1 bg-surface-container rounded-full appearance-none accent-primary"
                />
              </div>

              <!-- Export Button -->
              <button
                @click="exportImage(saveExportScope === 'all')"
                :disabled="!selectedImages.length || isProcessing"
                class="w-full py-3 rounded-lg bg-primary hover:bg-primary-dim text-on-primary text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span class="material-symbols-outlined text-sm">download</span>
                Export {{ saveExportScope === 'all' ? 'All ' + selectedImages.length + ' Images' : (hasPdfFiles ? 'PDF' : 'Current Image') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed, onBeforeUnmount } from 'vue'
import { renderPresetText } from '../utils/presetTokens'
import suggestionsData from '../data/presets.json'

const { t, locale, setLocale } = useI18n()

const toggleLanguage = () => {
  setLocale(locale.value === 'en' ? 'es' : 'en')
}

const uploaderRef = ref(null)
const activeTab = ref('files')
const exportFormat = ref('png')
const exportQuality = ref(90)
const maxExportSize = ref(0)
const showSaveDropdown = ref(false)
const saveButtonRef = ref(null)
const saveExportScope = ref('current')
const suggestionsCarouselRef = ref(null)

// PDF page navigation
const currentPdfPage = ref(1)
const currentPdfPages = ref(0)

// Preview controls height
const previewHeight = ref(45)
const controlsHeight = ref(55)
const tabsCollapsed = ref(false)
let lastScrollY = 0

// Detect if any PDFs are selected
const hasPdfFiles = computed(() => {
  return selectedImages.value.some(img => img.type === 'application/pdf')
})

// Dynamic export formats based on file type
const currentExportFormats = computed(() => {
  if (hasPdfFiles.value) {
    return [
      { value: 'pdf', label: 'PDF' },
      { value: 'png', label: 'PNG' },
      { value: 'jpg', label: 'JPG' }
    ]
  }
  return exportFormats
})

// Export formats (expanded)
const exportFormats = [
  { value: 'png', label: 'PNG' },
  { value: 'jpg', label: 'JPG' },
  { value: 'webp', label: 'WebP' },
  { value: 'bmp', label: 'BMP' },
  { value: 'tiff', label: 'TIFF' },
  { value: 'avif', label: 'AVIF' }
]

// Mobile tabs configuration
const mobileTabs = [
  { id: 'files', label: 'Files', icon: 'upload_file' },
  { id: 'presets', label: 'Presets', icon: 'auto_fix_high' },
  { id: 'config', label: 'Edit', icon: 'tune' },
  { id: 'manager', label: 'Layers', icon: 'layers' },
  { id: 'save', label: 'Save', icon: 'save' }
]

// Undo/Redo state
const history = ref([])
const historyIndex = ref(-1)
const maxHistorySize = 50

// Business name setting (default: Hostal Zamora)
const businessName = ref('Hostal Zamora')

const loadSettings = () => {
  try {
    const s = localStorage.getItem('markshield_settings')
    if (s) {
      const parsed = JSON.parse(s)
      if (parsed.businessName) businessName.value = parsed.businessName
    }
  } catch {}
}

const saveSettings = () => {
  try {
    localStorage.setItem('markshield_settings', JSON.stringify({ businessName: businessName.value }))
  } catch {}
}

watch(businessName, saveSettings)

// Saved presets in localStorage
const savedPresets = ref([])
const MAX_SAVED_PRESETS = 10

// Load presets from localStorage
const loadPresets = () => {
  try {
    const stored = localStorage.getItem('markshield_presets')
    if (stored) {
      savedPresets.value = JSON.parse(stored)
    }
  } catch (e) {
    console.warn('Failed to load presets:', e)
  }
}

// Save current watermark as preset
const saveCurrentAsPreset = () => {
  const preset = {
    id: 'saved_' + Date.now(),
    label: currentWatermark.text || 'Custom Preset',
    icon: 'bookmark',
    ...JSON.parse(JSON.stringify(currentWatermark)),
    savedAt: Date.now()
  }

  savedPresets.value.unshift(preset)

  if (savedPresets.value.length > MAX_SAVED_PRESETS) {
    savedPresets.value = savedPresets.value.slice(0, MAX_SAVED_PRESETS)
  }

  try {
    localStorage.setItem('markshield_presets', JSON.stringify(savedPresets.value))
  } catch (e) {
    console.warn('Failed to save preset:', e)
  }
}

// Manual save from suggestion bar — also logs full config so user can copy to presets.json
const saveCurrentAsPresetManual = () => {
  saveCurrentAsPreset()
  console.log('[MarkShield] Preset config (copy into data/presets.json):\n' + JSON.stringify({ ...currentWatermark, id: 'preset_' + Date.now(), label: currentWatermark.text || 'Custom', size: currentWatermark.fontSize }, null, 2))
}

// Delete a saved preset
const deleteSavedPreset = (id, event) => {
  event.stopPropagation()
  savedPresets.value = savedPresets.value.filter(p => p.id !== id)
  try {
    localStorage.setItem('markshield_presets', JSON.stringify(savedPresets.value))
  } catch (e) {
    console.warn('Failed to delete preset:', e)
  }
}

// Expanded presets showing all combinations
const suggestions = suggestionsData

const visibleSuggestions = computed(() => suggestions.filter(s => !s.hidden))

const scrollSuggestions = (dir) => {
  if (suggestionsCarouselRef.value) {
    suggestionsCarouselRef.value.scrollBy({ left: dir * 220, behavior: 'smooth' })
  }
}

const applySuggestion = (sug) => {
  // Save current config as custom preset before switching (skip defaults)
  const isDefaultText = currentWatermark.text === 'Watermark' || !currentWatermark.text
  if (!isDefaultText && savedPresets.value.length < MAX_SAVED_PRESETS) {
    saveCurrentAsPreset()
  }
  const suggestionConfig = {
    text: renderPresetText(sug.text, { locale: navigator.language || locale.value, businessName: businessName.value }),
    fontSize: sug.size,
    color: sug.color,
    opacity: sug.opacity,
    pattern: sug.pattern,
    rotation: sug.rotation || 0,
    x: 50,
    y: 50,
    colorMode: sug.colorMode || 'solid',
    gradientStart: sug.gradientStart || '#667eea',
    gradientEnd: sug.gradientEnd || '#764ba2',
    gradientAngle: sug.gradientAngle || 45,
    randomColorMin: sug.randomColorMin || '#667eea',
    randomColorMax: sug.randomColorMax || '#764ba2',
    randomOpacityMin: sug.randomOpacityMin || 0.3,
    randomOpacityMax: sug.randomOpacityMax || 0.8,
    bgEnabled: sug.bgEnabled || false,
    bgColor: sug.bgColor || '#000000',
    bgOpacity: sug.bgOpacity || 0.5,
    bgPadding: sug.bgPadding || 10,
    bgRadius: sug.bgRadius || 5,
    borderEnabled: sug.borderEnabled || false,
    borderColor: sug.borderColor || '#ffffff',
    borderWidth: sug.borderWidth || 2,
    borderOpacity: sug.borderOpacity || 1,
    borderStyle: sug.borderStyle || 'solid',
    borderRadius: sug.borderRadius || 0,
    patternSpacingX: sug.patternSpacingX ?? 3,
    patternSpacingY: sug.patternSpacingY ?? 2.5,
    patternSpacingXUnit: sug.patternSpacingXUnit ?? sug.patternSpacingUnit ?? 'lines',
    patternSpacingYUnit: sug.patternSpacingYUnit ?? sug.patternSpacingUnit ?? 'lines',
    patternOffset: sug.patternOffset ?? 1.5,
    patternGapY: sug.patternGapY ?? (sug.patternGapTop ?? 0) + (sug.patternGapBottom ?? 0),
    patternRandomOffset: sug.patternRandomOffset || false,
    patternRotation: sug.patternRotation ?? 0,
    lineHeightMultiplier: sug.lineHeightMultiplier ?? 1.5,
    textCutout: sug.textCutout || false,
    bgColorMode: sug.bgColorMode || 'solid',
    bgGradientStart: sug.bgGradientStart || '#333333',
    bgGradientEnd: sug.bgGradientEnd || '#000000',
    bgGradientAngle: sug.bgGradientAngle ?? 0,
    bgRandomColorMin: sug.bgRandomColorMin || '#000000',
    bgRandomColorMax: sug.bgRandomColorMax || '#333333',
    bgPaddingAuto: sug.bgPaddingAuto || false,
    bgPaddingMult: sug.bgPaddingMult ?? 0.3,
    bgRadiusAuto: sug.bgRadiusAuto || false,
    bgRadiusMult: sug.bgRadiusMult ?? 0.15,
    borderColorMode: sug.borderColorMode || 'solid',
    borderGradientStart: sug.borderGradientStart || '#ffffff',
    borderGradientEnd: sug.borderGradientEnd || '#cccccc',
    borderGradientAngle: sug.borderGradientAngle ?? 0,
    borderRandomColorMin: sug.borderRandomColorMin || '#cccccc',
    borderRandomColorMax: sug.borderRandomColorMax || '#ffffff',
    randomizeOpacity: sug.randomizeOpacity || false,
    opacityMin: sug.opacityMin ?? 0.3,
    opacityMax: sug.opacityMax ?? 0.8,
    randomizeSize: sug.randomizeSize || false,
    sizeMin: sug.sizeMin ?? 16,
    sizeMax: sug.sizeMax ?? 64,
    randomizeRotation: sug.randomizeRotation || false,
    rotationMin: sug.rotationMin ?? -30,
    rotationMax: sug.rotationMax ?? 30,
    textStrokeEnabled: sug.textStrokeEnabled || false,
    textStrokeColorMode: sug.textStrokeColorMode || 'solid',
    textStrokeColor: sug.textStrokeColor || '#000000',
    textStrokeGradientStart: sug.textStrokeGradientStart || '#000000',
    textStrokeGradientEnd: sug.textStrokeGradientEnd || '#555555',
    textStrokeGradientAngle: sug.textStrokeGradientAngle ?? 45,
    textStrokeRandomColorMin: sug.textStrokeRandomColorMin || '#000000',
    textStrokeRandomColorMax: sug.textStrokeRandomColorMax || '#555555',
    textStrokeWidth: sug.textStrokeWidth ?? 2,
    textStrokeOpacity: sug.textStrokeOpacity ?? 1,
  }

  saveToHistory()
  updateCurrentWatermark(suggestionConfig)
}

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

// Wrap resetAll to also clear uploader internal state
const resetAllAndClear = () => {
  uploaderRef.value?.clearAll()
  resetAll()
  currentImageIndex.value = 0
  activeTab.value = 'files'
}

// Paged image navigation
const currentImageIndex = ref(0)
const currentImage = computed(() => selectedImages.value[currentImageIndex.value] ?? null)
const currentImagePreview = computed(() => currentImage.value?.preview ?? null)

const goToPrevImage = () => {
  if (currentImageIndex.value > 0) currentImageIndex.value--
}
const goToNextImage = () => {
  if (currentImageIndex.value < selectedImages.value.length - 1) currentImageIndex.value++
}

const handleRemoveImage = (index) => {
  uploaderRef.value?.removeImage(index)
  // clamp index after removal
  if (currentImageIndex.value >= selectedImages.value.length - 1) {
    currentImageIndex.value = Math.max(0, selectedImages.value.length - 2)
  }
}

// Handle images uploaded
const handleImagesUploaded = (images) => {
  updateSelectedImages(images)
  if (images && images.length > 0) {
    // Jump to the last newly added image
    currentImageIndex.value = images.length - 1
    activeTab.value = 'presets'
  }
}

// Watch for PDF page count when current image changes
watch(currentImage, async (img) => {
  if (img?.type === 'application/pdf') {
    try {
      const { getPdfPageCount } = await import('../utils/pdfProcessor')
      currentPdfPages.value = await getPdfPageCount(img.file)
    } catch {
      currentPdfPages.value = img.pageCount || 1
    }
    currentPdfPage.value = 1
  } else {
    currentPdfPages.value = 0
    currentPdfPage.value = 1
  }
})

// Undo/Redo functions
const saveToHistory = () => {
  const state = JSON.parse(JSON.stringify(currentWatermark))

  if (historyIndex.value < history.value.length - 1) {
    history.value = history.value.slice(0, historyIndex.value + 1)
  }

  history.value.push(state)

  if (history.value.length > maxHistorySize) {
    history.value.shift()
  } else {
    historyIndex.value++
  }
}

const undo = () => {
  if (historyIndex.value > 0) {
    historyIndex.value--
    const state = history.value[historyIndex.value]
    updateCurrentWatermark(state)
  }
}

const redo = () => {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++
    const state = history.value[historyIndex.value]
    updateCurrentWatermark(state)
  }
}

const canUndo = ref(false)
const canRedo = ref(false)

// Watch history state
watch(historyIndex, (newIndex) => {
  canUndo.value = newIndex > 0
  canRedo.value = newIndex < history.value.length - 1
})

// Save initial state
history.value.push(JSON.parse(JSON.stringify(currentWatermark)))
historyIndex.value = 0

// Debounce history saves so rapid slider drags don't flood the history stack
let _historyBatchTimer = null
const handleWatermarkUpdate = (newWatermark) => {
  // Capture the pre-change state only once at the start of a burst
  if (_historyBatchTimer === null) saveToHistory()
  clearTimeout(_historyBatchTimer)
  _historyBatchTimer = setTimeout(() => { _historyBatchTimer = null }, 600)
  updateCurrentWatermark(newWatermark)
}

// Load a saved watermark into currentWatermark for editing
const handleEditWatermark = (index) => {
  const wm = watermarks.value[index]
  if (wm) {
    saveToHistory()
    updateCurrentWatermark({ ...wm })
    activeTab.value = 'config'
  }
}

// Trigger file input from preview empty state
const triggerFileInput = () => {
  if (uploaderRef.value) {
    uploaderRef.value.triggerFileInput()
  }
}

// Handle scroll to collapse tabs
const handleScroll = (e) => {
  const scrollY = e.target.scrollTop
  if (scrollY > 50 && !tabsCollapsed.value) {
    tabsCollapsed.value = true
  } else if (scrollY <= 50 && tabsCollapsed.value) {
    tabsCollapsed.value = false
  }
  lastScrollY = scrollY
}

// Export image
const exportImage = async (exportAll = false) => {
  if (!selectedImages.value.length) return

  isProcessing.value = true

  try {
    // Determine which images to export
    const imagesToExport = exportAll ? selectedImages.value : [selectedImages.value[currentImageIndex.value] ?? selectedImages.value[0]]
    
    for (const image of imagesToExport) {
      // Handle PDF export
      if (image.type === 'application/pdf' || exportFormat.value === 'pdf') {
        const { renderAllPdfPages, exportCanvasesToPdf, downloadBlob } = await import('../utils/pdfProcessor')

        // Render all PDF pages
        const pages = await renderAllPdfPages(image.file, 2)

        // Apply watermarks to each page
        const watermarkedCanvases = []

        for (const page of pages) {
          const canvas = page.canvas
          const ctx = canvas.getContext('2d')

          // Apply watermarks with full settings
          await applyWatermarksToCanvas(ctx, canvas)

          watermarkedCanvases.push({ canvas, name: `page-${page.pageNum}` })
        }

        // Export as PDF
        const originalName = image.file?.name?.replace(/\.pdf$/i, '') || 'document'
        const pdfBlob = await exportCanvasesToPdf(watermarkedCanvases, `watermarked-${originalName}.pdf`)
        downloadBlob(pdfBlob, `watermarked-${originalName}.pdf`)
      } else {
        // Handle regular image export
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = image.preview
        await new Promise(resolve => img.onload = resolve)

        // Apply size limit if set
        let targetWidth = img.width
        let targetHeight = img.height
        
        if (maxExportSize.value > 0) {
          const maxSize = maxExportSize.value
          if (img.width > maxSize || img.height > maxSize) {
            const scale = Math.min(maxSize / img.width, maxSize / img.height)
            targetWidth = Math.round(img.width * scale)
            targetHeight = Math.round(img.height * scale)
          }
        }

        canvas.width = targetWidth
        canvas.height = targetHeight

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight)

        // Apply watermarks with full settings
        await applyWatermarksToCanvas(ctx, canvas)

        // Export
        const format = exportFormat.value
        let mimeType = 'image/png'
        if (format === 'jpg') mimeType = 'image/jpeg'
        else if (format === 'webp') mimeType = 'image/webp'
        else if (format === 'bmp') mimeType = 'image/bmp'
        else if (format === 'avif') mimeType = 'image/avif'

        const quality = format === 'png' || format === 'bmp' || format === 'tiff' ? undefined : exportQuality.value / 100
        const originalName = image.file?.name?.replace(/\.[^/.]+$/, '') || 'image'
        const suffix = imagesToExport.length > 1 ? `-${imagesToExport.indexOf(image) + 1}` : ''

        const blob = await new Promise(resolve => canvas.toBlob(resolve, mimeType, quality))
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `watermarked-${originalName}${suffix}.${format}`
          a.click()
          URL.revokeObjectURL(url)
        }
      } // end else (image export)
    } // end for loop
  } catch (error) {
    console.error('Error exporting image:', error)
    alert('Export failed: ' + error.message)
  } finally {
    isProcessing.value = false
  }
}

// Helper function to apply watermarks to canvas with full settings
const applyWatermarksToCanvas = async (ctx, canvas) => {
  const allWatermarks = [...watermarks.value, currentWatermark]

  for (const wm of allWatermarks) {
    if (!wm.text) continue

    const fontSize = (wm.fontSize || 32) * (canvas.width / 1000)
    const lineHeight = fontSize * (wm.lineHeightMultiplier || 1.5)
    
    ctx.font = `bold ${fontSize}px Inter, sans-serif`
    
    // Get text color
    let textColor = wm.color || '#ffffff'
    let textOpacity = wm.opacity || 0.7

    if (wm.colorMode === 'gradient') {
      const textLines = (wm.text || '').split('\n')
      let maxTextWidth = 0
      textLines.forEach(line => {
        const metrics = ctx.measureText(line)
        if (metrics.width > maxTextWidth) maxTextWidth = metrics.width
      })
      
      const angle = (wm.gradientAngle || 45) * Math.PI / 180
      const gradientLength = maxTextWidth * 1.5
      const x1 = -Math.cos(angle) * gradientLength / 2
      const x2 = Math.cos(angle) * gradientLength / 2
      const y1 = -Math.sin(angle) * gradientLength / 2
      const y2 = Math.sin(angle) * gradientLength / 2

      const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
      gradient.addColorStop(0, wm.gradientStart || '#667eea')
      gradient.addColorStop(1, wm.gradientEnd || '#764ba2')
      textColor = gradient
    } else if (wm.colorMode === 'random' || wm.colorMode === 'random_gradient') {
      textColor = getRandomExportColor(wm.randomColorMin || '#667eea', wm.randomColorMax || '#764ba2')
      textOpacity = wm.randomOpacityMin + Math.random() * (wm.randomOpacityMax - wm.randomOpacityMin)
    }

    const x = (wm.x / 100) * canvas.width
    const y = (wm.y / 100) * canvas.height
    const textLines = (wm.text || '').split('\n')
    const totalHeight = textLines.length * lineHeight
    const startY = -totalHeight / 2 + lineHeight / 2

    if (wm.pattern) {
      const toPixels = (val, unit) => {
        if (unit === 'px') return val
        if (unit === 'em') return val * fontSize
        return val * lineHeight
      }
      const unitX = wm.patternSpacingXUnit ?? wm.patternSpacingUnit ?? 'lines'
      const unitY = wm.patternSpacingYUnit ?? wm.patternSpacingUnit ?? 'lines'
      const gapY = ((wm.patternGapY ?? wm.patternGapTop ?? 0) + (wm.patternGapBottom ?? 0)) * lineHeight
      let stepX = toPixels(wm.patternSpacingX || 3, unitX)
      let stepY = toPixels(wm.patternSpacingY || 2.5, unitY) + gapY
      const offset = (wm.patternOffset || 1.5) * lineHeight

      const exportTextLines = (wm.text || '').split('\n')
      let exportMaxTW = 0
      exportTextLines.forEach(l => { const m = ctx.measureText(l); if (m.width > exportMaxTW) exportMaxTW = m.width })
      stepX = Math.max(stepX, exportMaxTW + fontSize * 0.5)
      stepY = Math.max(stepY, exportTextLines.length * lineHeight + lineHeight * 0.3)

      const useRandomOffset = wm.patternRandomOffset || false
      const patternRotation = (wm.patternRotation || wm.rotation || 0) * Math.PI / 180

      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate(patternRotation)
      ctx.translate(-canvas.width / 2, -canvas.height / 2)

      const diag = Math.ceil(Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height))

      let row = 0
      let tileCount = 0
      for (let py = -diag; py < canvas.height + diag; py += stepY) {
        if (tileCount > 4000) break
        const rowOffset = useRandomOffset ? (Math.random() - 0.5) * offset * 2 : (row % 2 === 0 ? 0 : offset)
        for (let px = -diag + rowOffset; px < canvas.width + diag; px += stepX) {
          if (tileCount++ > 4000) break
          drawSingleWatermarkOnCanvas(ctx, wm, px, py, fontSize, 0, textColor, textOpacity, lineHeight)
        }
        row++
      }
      ctx.restore()
    } else {
      const rotation = (wm.rotation || 0) * Math.PI / 180
      drawSingleWatermarkOnCanvas(ctx, wm, x, y, fontSize, rotation, textColor, textOpacity, lineHeight)
    }
  }
}

const computeExportFillStyle = (ctx, mode, solid, gradStart, gradEnd, gradAngle, randMin, randMax, w, h) => {
  if (mode === 'gradient') {
    const a = (gradAngle || 0) * Math.PI / 180
    const cx = 0, cy = 0, dx = Math.cos(a) * w / 2, dy = Math.sin(a) * h / 2
    const g = ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy)
    g.addColorStop(0, gradStart || '#333333')
    g.addColorStop(1, gradEnd || '#000000')
    return g
  }
  if (mode === 'random') return getRandomExportColor(randMin || '#000000', randMax || '#333333')
  return solid || '#000000'
}

const drawSingleWatermarkOnCanvas = (ctx, wm, x, y, fontSize, rotation, textColor, textOpacity, lineHeight) => {
  ctx.save()

  // Per-tile random size
  let fs = fontSize
  if (wm.randomizeSize) {
    const minS = (wm.sizeMin || 16) * (ctx.canvas.width / 1000)
    const maxS = (wm.sizeMax || 64) * (ctx.canvas.width / 1000)
    fs = minS + Math.random() * (maxS - minS)
    ctx.font = `bold ${fs}px Inter, sans-serif`
  }

  // Per-tile random rotation
  let rot = rotation
  if (wm.randomizeRotation) {
    const mn = (wm.rotationMin ?? -30) * Math.PI / 180
    const mx = (wm.rotationMax ?? 30) * Math.PI / 180
    rot = mn + Math.random() * (mx - mn)
  }

  ctx.translate(x, y)
  ctx.rotate(rot)

  const textLines = (wm.text || 'Watermark').split('\n')
  const lh = fs * (wm.lineHeightMultiplier || 1.5)
  const totalHeight = textLines.length * lh
  const startY = -totalHeight / 2 + lh / 2

  let maxTextWidth = 0
  textLines.forEach(line => {
    const m = ctx.measureText(line)
    if (m.width > maxTextWidth) maxTextWidth = m.width
  })

  const textWidth = maxTextWidth
  const textHeight = totalHeight
  const padding = wm.bgPaddingAuto ? fs * (wm.bgPaddingMult || 0.3) : (wm.bgPadding ?? 10)
  const bgRadius = wm.bgRadiusAuto ? fs * (wm.bgRadiusMult || 0.15) : (wm.bgRadius ?? 0)
  const bw = wm.borderWidth || 2

  const bgX = -textWidth / 2 - padding
  const bgY = -textHeight / 2 - padding
  const bgW = textWidth + padding * 2
  const bgH = textHeight + padding * 2

  // Per-tile random opacity
  let tOpacity = wm.randomizeOpacity
    ? (wm.opacityMin ?? 0.3) + Math.random() * ((wm.opacityMax ?? 0.8) - (wm.opacityMin ?? 0.3))
    : textOpacity

  // Cutout mode
  if (wm.textCutout && wm.bgEnabled) {
    const pad = Math.max(padding, bw) + fs
    const offW = bgW + pad * 2
    const offH = bgH + pad * 2
    const off = document.createElement('canvas')
    off.width = offW; off.height = offH
    const oc = off.getContext('2d')
    oc.font = ctx.font
    oc.textBaseline = 'middle'
    oc.textAlign = 'center'
    const ox = offW / 2, oy = offH / 2
    oc.globalAlpha = wm.bgOpacity ?? 0.5
    oc.fillStyle = computeExportFillStyle(oc, wm.bgColorMode, wm.bgColor, wm.bgGradientStart, wm.bgGradientEnd, wm.bgGradientAngle, wm.bgRandomColorMin, wm.bgRandomColorMax, bgW, bgH)
    drawRoundedRectOnCanvas(oc, ox + bgX, oy + bgY, bgW, bgH, bgRadius)
    oc.fill()
    oc.globalCompositeOperation = 'destination-out'
    oc.globalAlpha = 1
    textLines.forEach((line, i) => oc.fillText(line, ox, oy + startY + i * lh))
    ctx.drawImage(off, -offW / 2, -offH / 2)
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    if (tOpacity > 0) {
      if (wm.textStrokeEnabled) {
        ctx.save()
        ctx.globalAlpha = tOpacity * (wm.textStrokeOpacity ?? 1)
        ctx.strokeStyle = computeExportFillStyle(ctx, wm.textStrokeColorMode, wm.textStrokeColor, wm.textStrokeGradientStart, wm.textStrokeGradientEnd, wm.textStrokeGradientAngle, wm.textStrokeRandomColorMin, wm.textStrokeRandomColorMax, maxTextWidth, totalHeight)
        ctx.lineWidth = (wm.textStrokeWidth ?? 2) * (fs / 32)
        ctx.lineJoin = 'round'
        textLines.forEach((line, i) => ctx.strokeText(line, 0, startY + i * lh))
        ctx.restore()
      }
      ctx.globalAlpha = tOpacity
      ctx.fillStyle = wm.color || '#ffffff'
      textLines.forEach((line, i) => ctx.fillText(line, 0, startY + i * lh))
    }
    if (wm.borderEnabled) drawExportBorder(ctx, wm, bgX, bgY, bgW, bgH, bw, bgRadius, fs)
    ctx.restore()
    return
  }

  // Normal background
  if (wm.bgEnabled) {
    ctx.save()
    ctx.globalAlpha = wm.bgOpacity ?? 0.5
    ctx.fillStyle = computeExportFillStyle(ctx, wm.bgColorMode, wm.bgColor, wm.bgGradientStart, wm.bgGradientEnd, wm.bgGradientAngle, wm.bgRandomColorMin, wm.bgRandomColorMax, bgW, bgH)
    drawRoundedRectOnCanvas(ctx, bgX, bgY, bgW, bgH, bgRadius)
    ctx.fill()
    ctx.restore()
  }

  if (wm.borderEnabled) drawExportBorder(ctx, wm, bgX, bgY, bgW, bgH, bw, bgRadius, fs)

  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'

  // Text stroke drawn before fill so fill covers inward bleed
  if (wm.textStrokeEnabled) {
    ctx.save()
    ctx.globalAlpha = tOpacity * (wm.textStrokeOpacity ?? 1)
    ctx.strokeStyle = computeExportFillStyle(ctx, wm.textStrokeColorMode, wm.textStrokeColor, wm.textStrokeGradientStart, wm.textStrokeGradientEnd, wm.textStrokeGradientAngle, wm.textStrokeRandomColorMin, wm.textStrokeRandomColorMax, maxTextWidth, totalHeight)
    ctx.lineWidth = (wm.textStrokeWidth ?? 2) * (fs / 32)
    ctx.lineJoin = 'round'
    textLines.forEach((line, i) => ctx.strokeText(line, 0, startY + i * lh))
    ctx.restore()
  }

  ctx.globalAlpha = tOpacity
  ctx.fillStyle = textColor
  textLines.forEach((line, i) => ctx.fillText(line, 0, startY + i * lh))
  ctx.restore()
}

const drawExportBorder = (ctx, wm, bgX, bgY, bgW, bgH, bw, radius, fontSize) => {
  ctx.save()
  ctx.strokeStyle = computeExportFillStyle(ctx, wm.borderColorMode, wm.borderColor, wm.borderGradientStart, wm.borderGradientEnd, wm.borderGradientAngle, wm.borderRandomColorMin, wm.borderRandomColorMax, bgW, bgH)
  ctx.globalAlpha = wm.borderOpacity ?? 1
  if (wm.borderStyle === 'dashed') {
    ctx.setLineDash([fontSize * 0.3, fontSize * 0.2])
    ctx.lineWidth = bw
    drawRoundedRectOnCanvas(ctx, bgX - bw / 2, bgY - bw / 2, bgW + bw, bgH + bw, radius)
    ctx.stroke()
  } else if (wm.borderStyle === 'dotted') {
    ctx.setLineDash([fontSize * 0.1, fontSize * 0.15])
    ctx.lineWidth = bw
    drawRoundedRectOnCanvas(ctx, bgX - bw / 2, bgY - bw / 2, bgW + bw, bgH + bw, radius)
    ctx.stroke()
  } else if (wm.borderStyle === 'double') {
    const gap = Math.max(2, bw / 3)
    ctx.lineWidth = gap
    ctx.setLineDash([])
    drawRoundedRectOnCanvas(ctx, bgX - bw, bgY - bw, bgW + bw * 2, bgH + bw * 2, radius + bw)
    ctx.stroke()
    drawRoundedRectOnCanvas(ctx, bgX + gap, bgY + gap, bgW - gap * 2, bgH - gap * 2, Math.max(0, radius - gap))
    ctx.stroke()
  } else {
    ctx.lineWidth = bw
    ctx.setLineDash([])
    drawRoundedRectOnCanvas(ctx, bgX - bw / 2, bgY - bw / 2, bgW + bw, bgH + bw, radius)
    ctx.stroke()
  }
  ctx.restore()
}

const drawRoundedRectOnCanvas = (ctx, x, y, width, height, radius) => {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

const getRandomExportColor = (min, max) => {
  const minRgb = hexToRgbExport(min)
  const maxRgb = hexToRgbExport(max)

  const r = Math.floor(minRgb.r + Math.random() * (maxRgb.r - minRgb.r))
  const g = Math.floor(minRgb.g + Math.random() * (maxRgb.g - minRgb.g))
  const b = Math.floor(minRgb.b + Math.random() * (maxRgb.b - minRgb.b))

  return `rgb(${r}, ${g}, ${b})`
}

const hexToRgbExport = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 255, g: 255, b: 255 }
}


// Restore state from localStorage (Android fix)
const restoreState = () => {
  try {
    const savedWatermarks = localStorage.getItem('markshield_watermarks')
    if (savedWatermarks) {
      const parsed = JSON.parse(savedWatermarks)
      if (parsed.length > 0) {
        parsed.forEach(wm => {
          watermarks.value.push(wm)
        })
      }
    }
    
    const savedCurrent = localStorage.getItem('markshield_current_watermark')
    if (savedCurrent) {
      const parsed = JSON.parse(savedCurrent)
      updateCurrentWatermark(parsed)
    }
    
    const savedHistory = localStorage.getItem('markshield_history')
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory)
      history.value = parsed
      historyIndex.value = Math.max(0, parsed.length - 1)
    }
  } catch (e) {
    console.warn('Failed to restore state:', e)
  }
}

// Save state to localStorage
const saveState = () => {
  try {
    localStorage.setItem('markshield_watermarks', JSON.stringify(watermarks.value))
    localStorage.setItem('markshield_current_watermark', JSON.stringify(currentWatermark))
    localStorage.setItem('markshield_history', JSON.stringify(history.value))
  } catch (e) {
    console.warn('Failed to save state:', e)
  }
}

// Watch for changes and save to localStorage
watch([watermarks, currentWatermark, history], () => {
  saveState()
}, { deep: true })

// Close save dropdown when clicking outside
const handleClickOutside = (event) => {
  if (saveButtonRef.value && !saveButtonRef.value.contains(event.target)) {
    showSaveDropdown.value = false
  }
}

// Watch for initial load
onMounted(() => {
  canUndo.value = false
  canRedo.value = false
  
  // Add click-outside listener
  document.addEventListener('click', handleClickOutside)

  // Keyboard navigation for images
  const handleKey = (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
    if (e.key === 'ArrowLeft') goToPrevImage()
    else if (e.key === 'ArrowRight') goToNextImage()
  }
  document.addEventListener('keydown', handleKey)
  onBeforeUnmount(() => document.removeEventListener('keydown', handleKey))

  // Load saved presets and settings
  loadPresets()
  loadSettings()

  // Restore state (Android fix)
  restoreState()

  // Handle visibility change (Android background/foreground)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'))
        if (selectedImages.value.length > 0) {
          updateCurrentWatermark({ ...currentWatermark })
        }
      }, 200)
    }
  })

  // Save state before page unload
  window.addEventListener('beforeunload', () => {
    saveState()
  })
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
