<template>
  <div class="bg-background text-on-surface font-body min-h-screen selection:bg-primary/30">
    <!-- Navigation -->
    <header class="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-12 h-20 bg-background/80 backdrop-blur-xl border-b border-white/5">
      <div class="flex items-center gap-2">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-dim to-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <span class="material-symbols-outlined text-on-primary text-xl" style="font-variation-settings: 'FILL' 1;">security</span>
        </div>
        <span class="text-xl font-black tracking-tighter text-on-surface uppercase">{{ t('app.title') }}</span>
      </div>

      <nav class="hidden md:flex items-center gap-8">
        <a href="#examples" class="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors tracking-widest uppercase">Examples</a>
        <a href="#features" class="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors tracking-widest uppercase">Features</a>
        <a href="#security" class="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors tracking-widest uppercase">Privacy</a>
      </nav>

      <div class="flex items-center gap-4">
        <button
          class="p-2 hover:bg-white/5 rounded-lg transition-all text-on-surface-variant hover:text-primary"
          @click="toggleLanguage"
        >
          <span class="material-symbols-outlined">language</span>
        </button>
        <NuxtLink
          to="/tool"
          class="px-6 py-2.5 text-xs font-bold bg-primary text-on-primary rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
        >
          {{ t('actions.getStarted') || 'Get Started' }}
        </NuxtLink>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="relative pt-32 md:pt-44 pb-20 md:pb-32 px-6 md:px-8 overflow-hidden">
      <!-- Background Glows -->
      <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div class="max-w-6xl mx-auto text-center relative z-10">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container border border-white/5 mb-6 md:mb-8 animate-fade-in">
          <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span class="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">Professional Watermark Studio</span>
        </div>

        <h1 class="text-4xl md:text-6xl lg:text-8xl font-black tracking-tightest leading-[0.9] mb-6 md:mb-8 bg-gradient-to-b from-on-surface via-on-surface to-on-surface-variant bg-clip-text text-transparent">
          Protect your <span class="text-primary">creative work</span> with precision watermarks.
        </h1>

        <p class="text-base md:text-lg lg:text-xl text-on-surface-variant max-w-3xl mx-auto mb-8 md:mb-12 font-medium leading-relaxed px-4">
          Add beautiful, customizable watermarks to your photos, artwork, and documents. Control every detail - from subtle signatures to bold tiled patterns. All processing happens in your browser, keeping your files 100% private.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
          <NuxtLink
            to="/tool"
            class="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 text-sm font-black bg-primary text-on-primary rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest flex items-center justify-center gap-3"
          >
            Launch Studio
            <span class="material-symbols-outlined text-lg">auto_awesome</span>
          </NuxtLink>
          <a
            href="#examples"
            class="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 text-sm font-black border border-white/10 hover:bg-white/5 text-on-surface rounded-2xl transition-all uppercase tracking-widest"
          >
            See Examples
          </a>
        </div>
      </div>
    </section>

    <!-- Examples Showcase Section -->
    <section id="examples" class="py-16 md:py-24 px-6 md:px-8">
      <div class="max-w-7xl mx-auto">
        <!-- Section Header -->
        <div class="text-center mb-12 md:mb-16">
          <h2 class="text-3xl md:text-5xl font-black tracking-tightest mb-4">Watermark Examples</h2>
          <p class="text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto px-4">See how professionals use MarkShield to protect their work</p>
        </div>

        <!-- Example Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <!-- Example 1: Photography -->
          <div class="group relative rounded-2xl overflow-hidden bg-surface-container border border-white/5 hover:border-primary/30 transition-all duration-500">
            <div class="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-violet-500/20 to-indigo-500/20">
              <!-- Simulated Photo -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-3/4 h-3/4 rounded-lg bg-surface-container-highest/50 flex items-center justify-center">
                  <span class="material-symbols-outlined text-6xl text-primary/40">photo_camera</span>
                </div>
              </div>
              <!-- Watermark Overlay -->
              <div class="absolute inset-0 flex items-center justify-center opacity-30">
                <span class="text-lg md:text-xl font-bold text-white rotate-[-30deg]">© John Doe</span>
              </div>
            </div>
            <div class="p-5 md:p-6">
              <h3 class="text-base md:text-lg font-bold mb-2">Photography Protection</h3>
              <p class="text-xs md:text-sm text-on-surface-variant leading-relaxed">Subtle corner signatures that don't distract from your beautiful shots but prevent unauthorized use.</p>
              <div class="flex items-center gap-2 mt-3">
                <span class="text-[10px] font-bold uppercase tracking-wider text-primary">Signature Style</span>
              </div>
            </div>
          </div>

          <!-- Example 2: Tiled Pattern -->
          <div class="group relative rounded-2xl overflow-hidden bg-surface-container border border-white/5 hover:border-primary/30 transition-all duration-500">
            <div class="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
              <!-- Simulated Artwork -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-3/4 h-3/4 rounded-lg bg-surface-container-highest/50 flex items-center justify-center">
                  <span class="material-symbols-outlined text-6xl text-blue-400/40">palette</span>
                </div>
              </div>
              <!-- Tiled Watermark -->
              <div class="absolute inset-0 opacity-20">
                <div class="grid grid-cols-4 grid-rows-3 gap-4 p-4">
                  <template v-for="i in 12" :key="i">
                    <span class="text-xs font-bold text-white rotate-[-45deg]">SAMPLE</span>
                  </template>
                </div>
              </div>
            </div>
            <div class="p-5 md:p-6">
              <h3 class="text-base md:text-lg font-bold mb-2">Portfolio Samples</h3>
              <p class="text-xs md:text-sm text-on-surface-variant leading-relaxed">Repeated patterns across the entire image, perfect for showcasing work while preventing theft.</p>
              <div class="flex items-center gap-2 mt-3">
                <span class="text-[10px] font-bold uppercase tracking-wider text-blue-400">Tiled Pattern</span>
              </div>
            </div>
          </div>

          <!-- Example 3: Document ID -->
          <div class="group relative rounded-2xl overflow-hidden bg-surface-container border border-white/5 hover:border-primary/30 transition-all duration-500">
            <div class="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <!-- Simulated ID Document -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-3/4 h-3/4 rounded-lg bg-surface-container-highest/50 flex items-center justify-center">
                  <span class="material-symbols-outlined text-6xl text-purple-400/40">badge</span>
                </div>
              </div>
              <!-- ID Watermark -->
              <div class="absolute inset-0 flex items-center justify-center opacity-40">
                <div class="px-4 py-2 bg-black/50 rounded-lg">
                  <span class="text-sm md:text-base font-bold text-purple-300">FOR VERIFICATION ONLY</span>
                </div>
              </div>
            </div>
            <div class="p-5 md:p-6">
              <h3 class="text-base md:text-lg font-bold mb-2">ID & Document Security</h3>
              <p class="text-xs md:text-sm text-on-surface-variant leading-relaxed">Clear verification marks that prevent document misuse while maintaining readability.</p>
              <div class="flex items-center gap-2 mt-3">
                <span class="text-[10px] font-bold uppercase tracking-wider text-purple-400">Security Mark</span>
              </div>
            </div>
          </div>

          <!-- Example 4: Brand Logo -->
          <div class="group relative rounded-2xl overflow-hidden bg-surface-container border border-white/5 hover:border-primary/30 transition-all duration-500">
            <div class="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-amber-500/20 to-orange-500/20">
              <!-- Simulated Design -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-3/4 h-3/4 rounded-lg bg-surface-container-highest/50 flex items-center justify-center">
                  <span class="material-symbols-outlined text-6xl text-amber-400/40">brush</span>
                </div>
              </div>
              <!-- Brand Watermark -->
              <div class="absolute bottom-4 right-4 opacity-60">
                <span class="text-sm font-bold text-white">Studio Pro ©</span>
              </div>
            </div>
            <div class="p-5 md:p-6">
              <h3 class="text-base md:text-lg font-bold mb-2">Brand Identity</h3>
              <p class="text-xs md:text-sm text-on-surface-variant leading-relaxed">Professional brand signatures that establish ownership and build recognition across your portfolio.</p>
              <div class="flex items-center gap-2 mt-3">
                <span class="text-[10px] font-bold uppercase tracking-wider text-amber-400">Brand Mark</span>
              </div>
            </div>
          </div>

          <!-- Example 5: Draft Mode -->
          <div class="group relative rounded-2xl overflow-hidden bg-surface-container border border-white/5 hover:border-primary/30 transition-all duration-500">
            <div class="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-gray-500/20 to-slate-500/20">
              <!-- Simulated Draft -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-3/4 h-3/4 rounded-lg bg-surface-container-highest/50 flex items-center justify-center">
                  <span class="material-symbols-outlined text-6xl text-gray-400/40">draft</span>
                </div>
              </div>
              <!-- Draft Watermark -->
              <div class="absolute inset-0 flex items-center justify-center opacity-15">
                <span class="text-4xl md:text-6xl font-black text-white rotate-[-45deg]">DRAFT</span>
              </div>
            </div>
            <div class="p-5 md:p-6">
              <h3 class="text-base md:text-lg font-bold mb-2">Draft & Review</h3>
              <p class="text-xs md:text-sm text-on-surface-variant leading-relaxed">Large, clear markers for works in progress that indicate the document status without ruining the design.</p>
              <div class="flex items-center gap-2 mt-3">
                <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Draft Status</span>
              </div>
            </div>
          </div>

          <!-- Example 6: Gradient Effect -->
          <div class="group relative rounded-2xl overflow-hidden bg-surface-container border border-white/5 hover:border-primary/30 transition-all duration-500">
            <div class="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
              <!-- Simulated Art -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-3/4 h-3/4 rounded-lg bg-surface-container-highest/50 flex items-center justify-center">
                  <span class="material-symbols-outlined text-6xl text-emerald-400/40">auto_awesome</span>
                </div>
              </div>
              <!-- Gradient Watermark -->
              <div class="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-50">
                <span class="text-lg font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">Premium Art</span>
              </div>
            </div>
            <div class="p-5 md:p-6">
              <h3 class="text-base md:text-lg font-bold mb-2">Gradient Effects</h3>
              <p class="text-xs md:text-sm text-on-surface-variant leading-relaxed">Beautiful gradient watermarks that complement your artwork while maintaining professional protection.</p>
              <div class="flex items-center gap-2 mt-3">
                <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Gradient Style</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Specs / Grid -->
    <section id="features" class="py-16 md:py-20 px-6 md:px-8 bg-surface-container-low/30">
      <div class="max-w-6xl mx-auto">
        <!-- Section Header -->
        <div class="text-center mb-12 md:mb-16">
          <h2 class="text-3xl md:text-4xl lg:text-5xl font-black tracking-tightest mb-4">Powerful Watermark Features</h2>
          <p class="text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto px-4">Everything you need to protect your creative work with professional-grade watermarks.</p>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-16 md:mb-20">
          <div class="space-y-4 group">
            <div class="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-500">
              <span class="material-symbols-outlined">text_fields</span>
            </div>
            <h3 class="text-base md:text-lg font-bold">Full Text Control</h3>
            <p class="text-xs md:text-sm text-on-surface-variant leading-relaxed">Customize font size, rotation, position, and color. Add borders, backgrounds, and gradient effects to make your watermarks unique.</p>
          </div>
          <div class="space-y-4 group">
            <div class="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-500">
              <span class="material-symbols-outlined">grid_view</span>
            </div>
            <h3 class="text-base md:text-lg font-bold">Tiled Patterns</h3>
            <p class="text-xs md:text-sm text-on-surface-variant leading-relaxed">Create repeating watermark patterns across your entire image with customizable spacing, rotation, and random offsets for maximum protection.</p>
          </div>
          <div class="space-y-4 group">
            <div class="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-500">
              <span class="material-symbols-outlined">layers</span>
            </div>
            <h3 class="text-base md:text-lg font-bold">Multiple Watermarks</h3>
            <p class="text-xs md:text-sm text-on-surface-variant leading-relaxed">Stack multiple watermarks with different styles, positions, and opacities. Save your favorite configurations for quick reuse.</p>
          </div>
          <div class="space-y-4 group">
            <div class="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-500">
              <span class="material-symbols-outlined">photo_library</span>
            </div>
            <h3 class="text-base md:text-lg font-bold">Batch Processing</h3>
            <p class="text-xs md:text-sm text-on-surface-variant leading-relaxed">Apply watermarks to multiple images at once. Perfect for photographers and content creators who need to protect entire portfolios.</p>
          </div>
          <div class="space-y-4 group">
            <div class="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-500">
              <span class="material-symbols-outlined">picture_as_pdf</span>
            </div>
            <h3 class="text-base md:text-lg font-bold">PDF Support</h3>
            <p class="text-xs md:text-sm text-on-surface-variant leading-relaxed">Protect your documents too. Add watermarks to PDF files with the same precision and customization options as images.</p>
          </div>
          <div class="space-y-4 group">
            <div class="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-500">
              <span class="material-symbols-outlined">palette</span>
            </div>
            <h3 class="text-base md:text-lg font-bold">Smart Presets</h3>
            <p class="text-xs md:text-sm text-on-surface-variant leading-relaxed">Start with professionally designed watermark templates. One click to apply, then customize to match your exact needs.</p>
          </div>
        </div>

        <!-- Data Protection Section -->
        <div id="security" class="border-t border-white/5 pt-16 md:pt-20">
          <div class="text-center mb-12 md:mb-16">
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-black tracking-tightest mb-4">Your Data Stays Private</h2>
            <p class="text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto px-4">Security isn't a feature - it's our foundation. Your files never leave your browser.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            <div class="space-y-4 group">
              <div class="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-500">
                <span class="material-symbols-outlined">visibility_off</span>
              </div>
              <h3 class="text-base md:text-lg font-bold">Zero-Knowledge Processing</h3>
              <p class="text-xs md:text-sm text-on-surface-variant leading-relaxed">All watermarking happens locally in your browser. Your files are never uploaded to any server, ensuring complete privacy.</p>
            </div>
            <div class="space-y-4 group">
              <div class="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-500">
                <span class="material-symbols-outlined">security</span>
              </div>
              <h3 class="text-base md:text-lg font-bold">No Storage, No Logs</h3>
              <p class="text-xs md:text-sm text-on-surface-variant leading-relaxed">We don't store your files, track your usage, or collect any data. What happens in MarkShield stays in MarkShield.</p>
            </div>
            <div class="space-y-4 group">
              <div class="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-500">
                <span class="material-symbols-outlined">cloud_off</span>
              </div>
              <h3 class="text-base md:text-lg font-bold">Works Offline</h3>
              <p class="text-xs md:text-sm text-on-surface-variant leading-relaxed">Once loaded, MarkShield works completely offline. No internet connection required for watermarking your files.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-16 md:py-20 px-6 md:px-8 border-t border-white/5">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12 text-center md:text-left">
        <div class="max-w-md">
          <p class="text-2xl font-black mb-4">MarkShield</p>
          <p class="text-sm text-on-surface-variant">The Ethereal Studio for document security. Professional tools for private individuals.</p>
        </div>
        <div class="flex gap-6 md:gap-8 text-[10px] font-bold tracking-widest uppercase text-outline">
          <a href="#" class="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" class="hover:text-primary transition-colors">Security Whitepaper</a>
          <a href="#" class="hover:text-primary transition-colors">Terms</a>
        </div>
      </div>
      <div class="max-w-6xl mx-auto mt-8 pt-6 border-t border-white/5 text-center text-[10px] tracking-widest uppercase text-outline">
        v{{ config.public.version }}
      </div>
    </footer>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const { t, locale, setLocale } = useI18n()

const toggleLanguage = () => {
  setLocale(locale.value === 'en' ? 'es' : 'en')
}

useHead({
  title: 'MarkShield - Professional Watermark Studio',
  meta: [
    { name: 'description', content: 'Add beautiful, customizable watermarks to your photos, artwork, and documents. 100% private, browser-based.' }
  ]
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 1s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
