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
          <button class="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-all" @click="resetAll">{{ t('actions.reset') }}</button>
          
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
          
          <button
            class="px-5 py-2 text-sm font-bold border border-white/10 hover:bg-white/5 text-slate-200 rounded-lg shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
            :disabled="selectedImages.length < 2"
            @click="showBatchModal = true"
          >
            <span class="material-symbols-outlined text-sm">photo_library</span>
            Batch
          </button>
          <button class="px-5 py-2 text-sm font-bold bg-gradient-to-br from-primary-dim to-primary text-on-primary-fixed rounded-lg shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50 active:scale-95" :disabled="!selectedImages.length || isProcessing" @click="applyWatermarks">{{ t('actions.apply') }}</button>
          
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
              class="absolute top-full right-0 mt-2 w-48 bg-[#0a1628] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
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
                @click="exportImage(); showSaveDropdown = false"
                class="w-full py-2.5 px-3 text-xs font-bold bg-primary hover:bg-primary-dim text-on-primary transition-all flex items-center justify-center gap-1.5"
              >
                <span class="material-symbols-outlined text-sm">download</span>
                Export {{ hasPdfFiles ? 'PDF' : 'Image' }}
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
          @update-watermark="updateWatermark"
          @remove-watermark="removeWatermark"
          @apply-watermarks="applyWatermarks"
        />
        <WatermarkConfig
          :watermark="currentWatermark"
          @update:watermark="handleWatermarkUpdate"
        />
      </div>
      <div class="p-6 bg-surface-container-low/50 border-t border-white/5">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <span class="material-symbols-outlined text-on-primary-fixed text-lg" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
          </div>
          <div>
            <p class="text-xs font-bold text-on-surface">The Lucid Curator</p>
            <p class="text-[10px] text-on-surface-variant">Pro Editor Active</p>
          </div>
        </div>
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
      <div class="h-48 bg-surface-container-low/30 border-t border-white/5 flex flex-col overflow-hidden">
        <div class="p-4 px-6 border-b border-white/5 flex items-center justify-between">
          <h4 class="text-[10px] font-black tracking-tightest uppercase text-on-surface-variant flex items-center gap-2">
            <span class="material-symbols-outlined text-sm text-primary">auto_fix_high</span>
            Smart Suggestions
          </h4>
          <!-- Business name inline edit -->
          <div class="flex items-center gap-2">
            <span class="text-[9px] text-on-surface-variant uppercase tracking-widest">Business:</span>
            <input
              v-model="businessName"
              class="text-[10px] font-bold bg-white/5 border border-white/10 rounded px-2 py-1 text-on-surface w-32 focus:outline-none focus:border-primary/50"
              placeholder="Hostal Zamora"
            />
          </div>
        </div>

        <div class="flex-1 overflow-x-auto p-6 scrollbar-hide">
          <div class="flex items-center gap-4 h-full">
            <button
              v-for="sug in suggestions"
              :key="sug.id"
              class="flex-shrink-0 w-56 h-full rounded-2xl bg-surface-container hover:bg-surface-container-high border border-white/5 hover:border-primary/20 transition-all group flex flex-col p-4 text-left relative overflow-hidden"
              @click="applySuggestion(sug)"
            >
              <div class="absolute top-0 right-0 w-16 h-16 bg-primary/5 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
              <div class="w-full h-20 rounded-lg bg-surface-container-highest mb-3 flex items-center justify-center overflow-hidden relative group-hover:scale-105 transition-transform">
                <div class="absolute inset-0 opacity-20">
                  <div class="w-full h-full bg-gradient-to-br from-violet-500/30 to-indigo-500/30"></div>
                </div>
                <span class="material-symbols-outlined text-3xl relative z-10" :style="{ color: sug.color }">{{ sug.icon }}</span>
                <div
                  class="absolute inset-0 flex items-center justify-center pointer-events-none"
                  :style="{ opacity: sug.opacity, transform: `rotate(${sug.rotation || 0}deg)` }"
                >
                  <span class="text-[8px] font-bold truncate px-2" :style="{ color: sug.color, fontSize: Math.min(10, sug.size / 3) + 'px' }">{{ sug.text }}</span>
                </div>
              </div>
              <p class="text-xs font-bold mb-1">{{ sug.label }}</p>
              <p class="text-[10px] text-on-surface-variant leading-tight opacity-60">{{ t(`suggestions.${sug.id}_desc`) || 'Custom styling preset' }}</p>
              <div class="mt-auto flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></span>
                <span class="text-[9px] font-bold text-outline tracking-widest uppercase">Apply Preset</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <ImageUploader ref="uploaderRef" @images-uploaded="handleImagesUploaded" />
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
          <div v-if="activeTab === 'files'" class="p-2">
            <ImageUploader ref="uploaderRef" @images-uploaded="handleImagesUploaded" />
            
            <!-- Batch & Reset Buttons in Files Tab -->
            <div v-if="selectedImages.length > 0" class="grid grid-cols-2 gap-2 mt-3">
              <button
                v-if="selectedImages.length >= 2"
                @click="showBatchModal = true"
                class="py-2.5 px-3 text-xs font-bold border border-white/10 hover:bg-white/5 text-slate-200 rounded-lg transition-all flex items-center justify-center gap-1.5"
              >
                <span class="material-symbols-outlined text-sm">photo_library</span>
                Batch Process
              </button>
              <button 
                @click="resetAll"
                class="py-2.5 px-3 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-all flex items-center justify-center gap-1.5"
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
              <div class="grid grid-cols-2 gap-2 mb-3">
                <button
                  v-for="preset in savedPresets"
                  :key="preset.id"
                  class="rounded-lg bg-surface-container hover:bg-surface-container-high border border-white/5 hover:border-primary/20 transition-all group flex flex-col p-2 text-left relative overflow-hidden"
                  @click="applySuggestion(preset)"
                >
                  <!-- Delete button -->
                  <button 
                    @click="deleteSavedPreset(preset.id, $event)"
                    class="absolute top-1 right-1 w-5 h-5 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white/60 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <span class="material-symbols-outlined text-[12px]">close</span>
                  </button>
                  
                  <div class="w-full h-20 rounded-md bg-surface-container-highest mb-1.5 flex items-center justify-center overflow-hidden relative">
                    <img
                      v-if="currentImagePreview"
                      :src="currentImagePreview"
                      class="absolute inset-0 w-full h-full object-cover opacity-40"
                    />
                    <div v-else class="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-indigo-500/20"></div>
                    <div
                      class="absolute inset-0 flex items-center justify-center pointer-events-none"
                      :style="{ opacity: preset.opacity || 0.7 }"
                    >
                      <span
                        class="font-bold px-1 text-center leading-tight"
                        :style="{
                          color: preset.color || '#ffffff',
                          fontSize: Math.min(11, (preset.fontSize || preset.size || 32) / 4) + 'px',
                          transform: `rotate(${preset.rotation || 0}deg)`
                        }"
                      >{{ preset.text }}</span>
                    </div>
                  </div>
                  <p class="text-[11px] font-bold truncate">{{ preset.label }}</p>
                </button>
              </div>
            </div>

            <!-- Default Presets Section -->
            <div>
              <h4 class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 px-1">Default Presets</h4>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="sug in suggestions"
                  :key="sug.id"
                  class="rounded-lg bg-surface-container hover:bg-surface-container-high border border-white/5 hover:border-primary/20 transition-all group flex flex-col p-2 text-left relative overflow-hidden"
                  @click="applySuggestion(sug)"
                >
                  <div class="w-full h-20 rounded-md bg-surface-container-highest mb-1.5 flex items-center justify-center overflow-hidden relative">
                    <img
                      v-if="currentImagePreview"
                      :src="currentImagePreview"
                      class="absolute inset-0 w-full h-full object-cover opacity-40"
                    />
                    <div v-else class="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-indigo-500/20"></div>
                    <div
                      class="absolute inset-0 flex items-center justify-center pointer-events-none"
                      :style="{ opacity: sug.opacity }"
                    >
                      <span
                        class="font-bold px-1 text-center leading-tight"
                        :style="{
                          color: sug.color,
                          fontSize: Math.min(11, sug.size / 4) + 'px',
                          transform: `rotate(${sug.rotation || 0}deg)`
                        }"
                      >{{ sug.text }}</span>
                    </div>
                  </div>
                  <p class="text-[11px] font-bold">{{ sug.label }}</p>
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
              @update-watermark="updateWatermark"
              @remove-watermark="removeWatermark"
              @apply-watermarks="applyWatermarks"
            />
          </div>

          <!-- Save Tab -->
          <div v-if="activeTab === 'save'" class="p-2 space-y-3">
            <div class="p-3 bg-surface-container rounded-lg space-y-3">
              <h4 class="text-xs font-bold text-on-surface">Export Settings</h4>

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
                <div class="flex justify-between text-[8px] text-on-surface-variant">
                  <span>Original</span>
                  <span>1024</span>
                  <span>2048</span>
                  <span>4096</span>
                </div>
              </div>

              <!-- Export Buttons -->
              <div class="space-y-2">
                <!-- Export First Image -->
                <button
                  @click="exportImage(false)"
                  :disabled="!selectedImages.length || isProcessing"
                  class="w-full py-3 rounded-lg bg-primary hover:bg-primary-dim text-on-primary text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span class="material-symbols-outlined text-sm">{{ hasPdfFiles ? 'picture_as_pdf' : 'download' }}</span>
                  Export {{ hasPdfFiles ? 'PDF' : 'Current Image' }}
                </button>

                <!-- Export All Images (if multiple) -->
                <button
                  v-if="selectedImages.length >= 2"
                  @click="exportImage(true)"
                  :disabled="isProcessing"
                  class="w-full py-3 rounded-lg border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span class="material-symbols-outlined text-sm">photo_library</span>
                  Export All {{ selectedImages.length }} Images
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Batch Process Modal -->
    <div v-if="showBatchModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" @click.self="showBatchModal = false">
      <div class="bg-[#0a1628] border border-white/10 rounded-2xl shadow-2xl max-w-sm w-full max-h-[70vh] overflow-hidden">
        <div class="p-4 border-b border-white/5 flex items-center justify-between">
          <h3 class="text-sm font-bold flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-base">photo_library</span>
            Batch Process
          </h3>
          <button @click="showBatchModal = false" class="p-1 hover:bg-white/5 rounded-lg transition-all">
            <span class="material-symbols-outlined text-base">close</span>
          </button>
        </div>
        
        <div class="p-4 overflow-y-auto max-h-[50vh]">
          <p class="text-xs text-on-surface-variant mb-3">Apply watermarks to all {{ selectedImages.length }} images</p>
          
          <div class="flex gap-2">
            <button 
              @click="batchProcess('png')"
              class="flex-1 py-2.5 rounded-lg bg-primary hover:bg-primary-dim text-on-primary text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span class="material-symbols-outlined text-sm">download</span>
              PNG
            </button>
            <button 
              @click="batchProcess('jpg')"
              class="flex-1 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 text-on-surface text-xs font-bold transition-all"
            >
              JPG
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed, onBeforeUnmount } from 'vue'
import { renderPresetText } from '../utils/presetTokens'

const { t, locale, setLocale } = useI18n()

const toggleLanguage = () => {
  setLocale(locale.value === 'en' ? 'es' : 'en')
}

const uploaderRef = ref(null)
const showBatchModal = ref(false)
const activeTab = ref('files')
const exportFormat = ref('png')
const exportQuality = ref(90)
const maxExportSize = ref(0) // 0 = no limit, otherwise max dimension in pixels
const showSaveDropdown = ref(false)
const saveButtonRef = ref(null)

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
const suggestions = [
  { id: 'confidential', label: 'Confidential', icon: 'visibility_off', color: '#ff6b6b', text: 'CONFIDENTIAL', size: 64, opacity: 0.6, pattern: false, rotation: -30, colorMode: 'solid', bgEnabled: false, borderEnabled: false },
  { id: 'tiled', label: 'Tiled Pattern', icon: 'grid_view', color: '#60a5fa', text: 'DO NOT COPY', size: 32, opacity: 0.3, pattern: true, rotation: -45, colorMode: 'solid', patternSpacingX: 3, patternSpacingY: 2.5, patternSpacingUnit: 'lines', patternOffset: 1.5, bgEnabled: false, borderEnabled: false },
  { id: 'identity', label: 'ID Security', icon: 'shield_person', color: '#8b5cf6', text: 'IDENTITY VERIFICATION', size: 24, opacity: 0.8, pattern: false, rotation: 0, colorMode: 'solid', bgEnabled: true, bgColor: '#000000', bgOpacity: 0.6, bgPadding: 10, bgRadius: 5, borderEnabled: false },
  { id: 'brand', label: 'Studio Mark', icon: 'stylus', color: '#ffffff', text: '© Ethereal Studio', size: 32, opacity: 0.5, pattern: false, rotation: 0, colorMode: 'solid', bgEnabled: false, borderEnabled: false },
  { id: 'draft', label: 'Draft Mode', icon: 'history_edu', color: '#a3a3a3', text: 'DRAFT', size: 100, opacity: 0.2, pattern: false, rotation: -45, colorMode: 'solid', bgEnabled: false, borderEnabled: false },
  { id: 'gradient_sunset', label: 'Sunset Glow', icon: 'wb_sunset', color: '#ff6b6b', text: 'PREMIUM CONTENT', size: 48, opacity: 0.7, pattern: false, rotation: -25, colorMode: 'gradient', gradientStart: '#ff6b6b', gradientEnd: '#ffd93d', gradientAngle: 45, bgEnabled: false, borderEnabled: false },
  { id: 'gradient_ocean', label: 'Ocean Wave', icon: 'waves', color: '#667eea', text: 'PROTECTED', size: 42, opacity: 0.6, pattern: false, rotation: -20, colorMode: 'gradient', gradientStart: '#667eea', gradientEnd: '#764ba2', gradientAngle: 90, bgEnabled: false, borderEnabled: false },
  { id: 'gradient_neon', label: 'Neon Flash', icon: 'flash_on', color: '#00ff87', text: 'NEON', size: 56, opacity: 0.8, pattern: false, rotation: -15, colorMode: 'gradient', gradientStart: '#00ff87', gradientEnd: '#00d4ff', gradientAngle: 135, bgEnabled: false, borderEnabled: false },
  { id: 'gradient_fire', label: 'Fire Burn', icon: 'local_fire_department', color: '#ff5722', text: 'FIRE', size: 52, opacity: 0.75, pattern: false, rotation: -20, colorMode: 'gradient', gradientStart: '#ff5722', gradientEnd: '#ffeb3b', gradientAngle: 60, bgEnabled: false, borderEnabled: false },
  { id: 'gradient_galaxy', label: 'Galaxy', icon: 'rocket', color: '#9c27b0', text: 'GALAXY', size: 46, opacity: 0.65, pattern: false, rotation: -30, colorMode: 'gradient', gradientStart: '#9c27b0', gradientEnd: '#e91e63', gradientAngle: 180, bgEnabled: false, borderEnabled: false },
  { id: 'gradient_arctic', label: 'Arctic', icon: 'ac_unit', color: '#00bcd4', text: 'ARCTIC', size: 44, opacity: 0.7, pattern: false, rotation: -25, colorMode: 'gradient', gradientStart: '#00bcd4', gradientEnd: '#2196f3', gradientAngle: 90, bgEnabled: false, borderEnabled: false },
  { id: 'random_gradient', label: 'Random Gradients', icon: 'gradient', color: '#667eea', text: 'RANDOM', size: 40, opacity: 0.6, pattern: true, rotation: -45, colorMode: 'random_gradient', patternSpacingX: 3, patternSpacingY: 2.5, patternSpacingUnit: 'lines', patternOffset: 1.5, bgEnabled: false, borderEnabled: false },
  { id: 'bg_shield', label: 'Shield Box', icon: 'shield', color: '#ffffff', text: 'VERIFIED', size: 36, opacity: 0.8, pattern: false, rotation: 0, colorMode: 'solid', bgEnabled: true, bgColor: '#0066ff', bgOpacity: 0.7, bgPadding: 15, bgRadius: 8, borderEnabled: true, borderColor: '#ffffff', borderWidth: 3, borderOpacity: 1, borderStyle: 'solid', borderRadius: 8 },
  { id: 'diag_tiled', label: 'Diagonal Tiles', icon: 'texture', color: '#00ff00', text: 'SAMPLE', size: 28, opacity: 0.25, pattern: true, rotation: -45, colorMode: 'solid', patternSpacingX: 2.5, patternSpacingY: 2, patternSpacingUnit: 'lines', patternOffset: 1.25, bgEnabled: false, borderEnabled: false },
  { id: 'random_scat', label: 'Random Scatter', icon: 'blur_on', color: '#ff00ff', text: 'PROOF', size: 30, opacity: 0.4, pattern: true, rotation: 0, colorMode: 'random', randomColorMin: '#ff00ff', randomColorMax: '#00ffff', randomOpacityMin: 0.3, randomOpacityMax: 0.7, patternSpacingX: 4, patternSpacingY: 3.5, patternSpacingUnit: 'lines', patternOffset: 2, patternRandomOffset: true, bgEnabled: false, borderEnabled: false },
  { id: 'dashed_border', label: 'Dashed Frame', icon: 'border_style', color: '#ff9800', text: 'REVIEW COPY', size: 44, opacity: 0.85, pattern: false, rotation: 0, colorMode: 'solid', bgEnabled: true, bgColor: '#1a1a1a', bgOpacity: 0.5, bgPadding: 10, bgRadius: 6, borderEnabled: true, borderColor: '#ff9800', borderWidth: 3, borderOpacity: 1, borderStyle: 'dashed', borderRadius: 6 },
  { id: 'pro_watermark', label: 'Pro Watermark', icon: 'workspace_premium', color: '#ffffff', text: '© PREMIUM', size: 50, opacity: 0.35, pattern: true, rotation: -45, colorMode: 'gradient', gradientStart: '#ffffff', gradientEnd: '#cccccc', gradientAngle: 45, patternSpacingX: 3.5, patternSpacingY: 3, patternSpacingUnit: 'lines', patternOffset: 1.75, bgEnabled: false, borderEnabled: false },
  // Multi-line repeating text presets with line-based spacing
  { id: 'multiline_security', label: 'Multi-Line Security', icon: 'text_rotate_up', color: '#ff0000', text: 'SECURE\nDOCUMENT\nVERIFIED', size: 36, opacity: 0.5, pattern: true, rotation: -30, colorMode: 'solid', patternSpacingX: 4, patternSpacingY: 3.5, patternSpacingUnit: 'lines', patternOffset: 2, bgEnabled: false, borderEnabled: false },
  { id: 'multiline_draft', label: 'Multi-Line Draft', icon: 'lines', color: '#999999', text: 'DRAFT\nDRAFT\nDRAFT', size: 48, opacity: 0.15, pattern: true, rotation: -45, colorMode: 'solid', patternSpacingX: 5, patternSpacingY: 4, patternSpacingUnit: 'lines', patternOffset: 2.5, bgEnabled: false, borderEnabled: false },
  { id: 'multiline_watermark', label: 'Multi-Line Mark', icon: 'format_line_spacing', color: '#00bfff', text: 'WATERMARK\nPROTECTED\nAUTHORIZED', size: 32, opacity: 0.4, pattern: true, rotation: -35, colorMode: 'gradient', gradientStart: '#00bfff', gradientEnd: '#1e90ff', gradientAngle: 45, patternSpacingX: 3.5, patternSpacingY: 3, patternSpacingUnit: 'lines', patternOffset: 1.75, bgEnabled: false, borderEnabled: false },
  { id: 'multiline_sample', label: 'Multi-Line Sample', icon: 'view_array', color: '#32cd32', text: 'SAMPLE\nNOT FOR\nDISTRIBUTION', size: 28, opacity: 0.35, pattern: true, rotation: -40, colorMode: 'solid', patternSpacingX: 3, patternSpacingY: 2.5, patternSpacingUnit: 'lines', patternOffset: 1.5, bgEnabled: false, borderEnabled: false },
  { id: 'multiline_confidential', label: 'Multi-Line Private', icon: 'lock_reset', color: '#ff69b4', text: 'PRIVATE\nCONFIDENTIAL\nDO NOT SHARE', size: 30, opacity: 0.45, pattern: true, rotation: -38, colorMode: 'solid', patternSpacingX: 4, patternSpacingY: 3.5, patternSpacingUnit: 'lines', patternOffset: 2, bgEnabled: false, borderEnabled: false },
  { id: 'multiline_verified', label: 'Multi-Line Verified', icon: 'verified_user', color: '#ffd700', text: 'VERIFIED\nAUTHENTIC\nCERTIFIED', size: 34, opacity: 0.55, pattern: true, rotation: -32, colorMode: 'gradient', gradientStart: '#ffd700', gradientEnd: '#ff8c00', gradientAngle: 90, patternSpacingX: 3.5, patternSpacingY: 3, patternSpacingUnit: 'lines', patternOffset: 1.75, bgEnabled: false, borderEnabled: false },
  { id: 'multiline_proof', label: 'Multi-Line Proof', icon: 'receipt_long', color: '#da70d6', text: 'PROOF\nOF CONCEPT\nNOT FINAL', size: 38, opacity: 0.3, pattern: true, rotation: -42, colorMode: 'solid', patternSpacingX: 4.5, patternSpacingY: 4, patternSpacingUnit: 'lines', patternOffset: 2.25, bgEnabled: false, borderEnabled: false },
  { id: 'multiline_review', label: 'Multi-Line Review', icon: 'rate_review', color: '#20b2aa', text: 'FOR REVIEW\nPURPOSES\nONLY', size: 36, opacity: 0.4, pattern: true, rotation: -36, colorMode: 'solid', patternSpacingX: 3.5, patternSpacingY: 3, patternSpacingUnit: 'lines', patternOffset: 1.75, bgEnabled: false, borderEnabled: false },
  // Business presets with token interpolation
  { id: 'hostal_zamora', label: 'Hostal Zamora', icon: 'hotel', color: '#fbbf24', text: 'Solo para {business}\n{month_name} {year}', size: 38, opacity: 0.65, pattern: true, rotation: -30, colorMode: 'gradient', gradientStart: '#fbbf24', gradientEnd: '#f59e0b', gradientAngle: 45, patternSpacingX: 4, patternSpacingY: 3.5, patternSpacingUnit: 'lines', patternOffset: 2, bgEnabled: false, borderEnabled: false },
  { id: 'business_exclusive', label: 'Uso Exclusivo', icon: 'shield_lock', color: '#ffffff', text: 'Uso exclusivo — {business}\n{date}', size: 32, opacity: 0.7, pattern: false, rotation: 0, colorMode: 'solid', bgEnabled: true, bgColor: '#0f172a', bgOpacity: 0.7, bgPadding: 12, bgRadius: 6, borderEnabled: true, borderColor: '#fbbf24', borderWidth: 2, borderOpacity: 1, borderStyle: 'solid', borderRadius: 6 },
  { id: 'business_property', label: 'Propiedad de', icon: 'copyright', color: '#a78bfa', text: 'Propiedad de {business} · {year}', size: 34, opacity: 0.6, pattern: false, rotation: -20, colorMode: 'gradient', gradientStart: '#a78bfa', gradientEnd: '#7c3aed', gradientAngle: 90, bgEnabled: false, borderEnabled: false },
  { id: 'business_month', label: 'Válido en Mes', icon: 'calendar_month', color: '#34d399', text: 'Válido solo en {month_name} {year}\n{business}', size: 30, opacity: 0.55, pattern: true, rotation: -35, colorMode: 'solid', patternSpacingX: 4.5, patternSpacingY: 4, patternSpacingUnit: 'lines', patternOffset: 2.25, bgEnabled: false, borderEnabled: false }
]

const applySuggestion = (sug) => {
  const suggestionConfig = {
    text: renderPresetText(sug.text, { locale: locale.value, businessName: businessName.value }),
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
    patternSpacingX: sug.patternSpacingX || 3,
    patternSpacingY: sug.patternSpacingY || 2.5,
    patternSpacingUnit: sug.patternSpacingUnit || 'lines',
    patternOffset: sug.patternOffset || 1.5,
    patternRandomOffset: sug.patternRandomOffset || false,
    lineHeightMultiplier: sug.lineHeightMultiplier || 1.5
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

// Handle watermark updates with history tracking
const handleWatermarkUpdate = (newWatermark) => {
  saveToHistory()
  updateCurrentWatermark(newWatermark)
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
      // Calculate spacing in pixels based on line height
      const spacingUnit = wm.patternSpacingUnit || 'lines'
      let stepX, stepY, offset

      if (spacingUnit === 'lines') {
        stepX = (wm.patternSpacingX || 3) * lineHeight
        stepY = (wm.patternSpacingY || 2.5) * lineHeight
        offset = (wm.patternOffset || 1.5) * lineHeight
      } else {
        stepX = wm.patternSpacingX || 150
        stepY = wm.patternSpacingY || 100
        offset = wm.patternOffset || 0
      }

      const useRandomOffset = wm.patternRandomOffset || false
      const patternRotation = ((wm.patternRotation || wm.rotation || 0)) * Math.PI / 180

      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate(patternRotation)
      ctx.translate(-canvas.width / 2, -canvas.height / 2)

      let row = 0
      for (let py = -stepY; py < canvas.height + stepY * 2; py += stepY) {
        const rowOffset = useRandomOffset ? (Math.random() - 0.5) * offset * 2 : (row % 2 === 0 ? 0 : offset)

        for (let px = -stepX + rowOffset; px < canvas.width + stepX * 2; px += stepX) {
          const adjustedX = px - canvas.width / 2
          const adjustedY = py - canvas.height / 2
          drawSingleWatermarkOnCanvas(ctx, wm, adjustedX, adjustedY, fontSize, 0, textColor, textOpacity, lineHeight)
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

const drawSingleWatermarkOnCanvas = (ctx, wm, x, y, fontSize, rotation, textColor, textOpacity, lineHeight) => {
  ctx.save()

  ctx.translate(x, y)
  ctx.rotate(rotation)

  const textLines = (wm.text || 'Watermark').split('\n')
  const totalHeight = textLines.length * lineHeight
  const startY = -totalHeight / 2 + lineHeight / 2

  // Measure text for background/border
  let maxTextWidth = 0
  textLines.forEach(line => {
    const metrics = ctx.measureText(line)
    if (metrics.width > maxTextWidth) maxTextWidth = metrics.width
  })

  const textWidth = maxTextWidth
  const textHeight = totalHeight
  const padding = wm.bgPadding || 10

  // Draw background if enabled
  if (wm.bgEnabled) {
    ctx.save()
    ctx.fillStyle = wm.bgColor || '#000000'
    ctx.globalAlpha = wm.bgOpacity || 0.5

    const bgX = -textWidth / 2 - padding
    const bgY = -textHeight / 2 - padding
    const bgWidth = textWidth + padding * 2
    const bgHeight = textHeight + padding * 2
    const radius = wm.bgRadius || 0

    drawRoundedRectOnCanvas(ctx, bgX, bgY, bgWidth, bgHeight, radius)
    ctx.fill()
    ctx.restore()
  }

  // Draw border if enabled
  if (wm.borderEnabled) {
    ctx.save()
    ctx.strokeStyle = wm.borderColor || '#ffffff'
    ctx.globalAlpha = wm.borderOpacity || 1
    ctx.lineWidth = wm.borderWidth || 2

    if (wm.borderStyle === 'dashed') {
      ctx.setLineDash([fontSize * 0.3, fontSize * 0.2])
    } else if (wm.borderStyle === 'dotted') {
      ctx.setLineDash([fontSize * 0.1, fontSize * 0.15])
    }

    const borderX = -textWidth / 2 - padding - wm.borderWidth
    const borderY = -textHeight / 2 - padding - wm.borderWidth
    const borderWidth = textWidth + (padding + wm.borderWidth) * 2
    const borderHeight = textHeight + (padding + wm.borderWidth) * 2
    const borderRadius = wm.borderRadius || 0

    drawRoundedRectOnCanvas(ctx, borderX, borderY, borderWidth, borderHeight, borderRadius)
    ctx.stroke()
    ctx.restore()
  }

  // Draw multi-line text
  ctx.globalAlpha = textOpacity
  ctx.fillStyle = textColor
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'

  textLines.forEach((line, index) => {
    const lineY = startY + (index * lineHeight)
    ctx.fillText(line, 0, lineY)
  })

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

// Batch process — routes through the same pipeline as single export
const batchProcess = async (format) => {
  showBatchModal.value = false
  exportFormat.value = format
  showBatchModal.value = false
  await exportImage(true)
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
