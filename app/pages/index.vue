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
        <div class="relative flex items-center gap-1 text-on-surface-variant">
          <span class="material-symbols-outlined text-lg pointer-events-none">language</span>
          <select
            :value="locale"
            class="appearance-none bg-transparent text-xs font-semibold uppercase tracking-widest cursor-pointer hover:text-primary transition-colors focus:outline-none pr-1"
            @change="setLocale($event.target.value)"
          >
            <option v-for="loc in locales" :key="loc.code" :value="loc.code" class="bg-surface text-on-surface">
              {{ loc.name }}
            </option>
          </select>
        </div>
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
    <!-- Examples Showcase Section -->
    <section id="examples" class="pt-16 md:pt-24">

      <!-- Section header -->
      <div class="max-w-4xl mx-auto px-6 md:px-8 pb-12 md:pb-16 text-center">
        <h2 class="text-3xl md:text-5xl font-black tracking-tightest mb-4">Watermark Examples</h2>
        <p class="text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto">Real situations where a simple watermark makes a big difference.</p>
      </div>

      <!-- ── EXAMPLE 1: DNI / Passport collage ── -->
      <div class="example-block">
        <div class="flex h-[55vh] md:h-[88vh]">

          <!-- BEFORE: clean collage -->
          <div class="ex-before flex-1 relative overflow-hidden bg-gradient-to-br from-slate-950 to-blue-950/70">
            <div class="dot-grid absolute inset-0"></div>

            <!-- DNI 1: top-center, frontmost -->
            <div class="collage-c1 absolute" style="top:5%;left:16%;width:54%;z-index:3;">
              <div class="rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                <img src="/pictures/dni1.jpg" alt="DNI" class="w-full block" />
              </div>
            </div>
            <!-- DNI 2: bottom-right -->
            <div class="collage-c2 absolute" style="bottom:12%;right:4%;width:48%;z-index:2;">
              <div class="rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                <img src="/pictures/dni2.jpg" alt="DNI" class="w-full block" />
              </div>
            </div>
            <!-- Pasaporte: bottom-left, behind -->
            <div class="collage-c3 absolute" style="bottom:4%;left:3%;width:52%;z-index:1;">
              <div class="rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                <img src="/pictures/pasporte.jpg" alt="Passport" class="w-full block" />
              </div>
            </div>

            <span class="absolute top-4 left-4 card-tag" style="z-index:10">Original</span>
          </div>

          <!-- Arrow bridge -->
          <div class="ex-arrow w-12 md:w-16 flex-shrink-0 flex flex-col items-center justify-center z-10 bg-background">
            <div class="w-px flex-1 bg-gradient-to-b from-transparent to-primary/25"></div>
            <div class="arrow-ring my-2 w-10 h-10 rounded-full bg-surface-container border border-primary/40 flex items-center justify-center shadow-xl shadow-primary/20 flex-shrink-0">
              <span class="material-symbols-outlined text-primary text-lg">arrow_forward</span>
            </div>
            <div class="w-px flex-1 bg-gradient-to-t from-transparent to-primary/25"></div>
          </div>

          <!-- AFTER: same collage with individual watermarks per document -->
          <div class="ex-after flex-1 relative overflow-hidden bg-gradient-to-br from-slate-950 to-blue-950/70">
            <div class="dot-grid absolute inset-0"></div>

            <!-- DNI 1 watermarked: hotel registration -->
            <div class="collage-c1 absolute" style="top:5%;left:16%;width:54%;z-index:3;">
              <div class="rounded-2xl overflow-hidden shadow-2xl border border-primary/30 relative">
                <img src="/pictures/dni1.jpg" alt="DNI watermarked" class="w-full block" />
                <div class="wm-band">
                  <template v-for="i in 40" :key="i">
                    <span>Only for hotel registration · May 2026 · Madrid &nbsp;&nbsp;</span>
                  </template>
                </div>
              </div>
            </div>
            <!-- DNI 2 watermarked: rental contract -->
            <div class="collage-c2 absolute" style="bottom:12%;right:4%;width:48%;z-index:2;">
              <div class="rounded-2xl overflow-hidden shadow-2xl border border-primary/30 relative">
                <img src="/pictures/dni2.jpg" alt="DNI watermarked" class="w-full block" />
                <div class="wm-band">
                  <template v-for="i in 40" :key="i">
                    <span>Only for rental property contract &nbsp;&nbsp;&nbsp;&nbsp;</span>
                  </template>
                </div>
              </div>
            </div>
            <!-- Pasaporte watermarked: certificate of birth -->
            <div class="collage-c3 absolute" style="bottom:4%;left:3%;width:52%;z-index:1;">
              <div class="rounded-2xl overflow-hidden shadow-2xl border border-primary/30 relative">
                <img src="/pictures/pasporte.jpg" alt="Passport watermarked" class="w-full block" />
                <div class="wm-band">
                  <template v-for="i in 40" :key="i">
                    <span>Only for certificate of birth · Jun 2027 &nbsp;&nbsp;&nbsp;&nbsp;</span>
                  </template>
                </div>
              </div>
            </div>

            <span class="absolute top-4 left-4 card-tag card-tag-active" style="z-index:10">Watermarked</span>
          </div>
        </div>

        <div class="ex-desc py-12 md:py-16 px-6 text-center max-w-2xl mx-auto">
          <h3 class="text-xl md:text-3xl font-black mb-3">Protect Your Identity Documents</h3>
          <p class="text-sm md:text-base text-on-surface-variant leading-relaxed">Mark your passport or DNI with the exact purpose before sharing it — hotel check-in, rental contract, certificate request. Prevents misuse like opening bank accounts or getting credit in your name.</p>
          <span class="inline-block mt-4 text-[10px] font-bold uppercase tracking-widest text-blue-400 border border-blue-400/30 px-4 py-2 rounded-full">Identity Protection</span>
        </div>
      </div>

      <!-- ── EXAMPLE 2: Wedding photography collage ── -->
      <div class="example-block border-t border-white/5">
        <div class="flex h-[55vh] md:h-[88vh]">

          <!-- BEFORE: clean wedding collage -->
          <div class="ex-before flex-1 relative overflow-hidden bg-gradient-to-br from-slate-950 to-violet-950/60">

            <!-- wedding.avif: main/largest -->
            <div class="wedding-c1 absolute" style="top:6%;left:10%;width:68%;z-index:3;">
              <div class="rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                <img src="/pictures/wedding.avif" alt="Wedding" class="w-full block" />
              </div>
            </div>
            <!-- wedding2.jpeg: top-right -->
            <div class="wedding-c2 absolute" style="top:3%;right:2%;width:44%;z-index:2;">
              <div class="rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                <img src="/pictures/wedding2.jpeg" alt="Wedding 2" class="w-full block" />
              </div>
            </div>
            <!-- wedding3.webp: bottom-left -->
            <div class="wedding-c3 absolute" style="bottom:10%;left:14%;width:66%;z-index:1;">
              <div class="rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                <img src="/pictures/wedding3.webp" alt="Wedding 3" class="w-full block" />
              </div>
            </div>

            <span class="absolute top-4 left-4 card-tag" style="z-index:10">Original</span>
          </div>

          <!-- Arrow bridge -->
          <div class="ex-arrow w-12 md:w-16 flex-shrink-0 flex flex-col items-center justify-center z-10 bg-background">
            <div class="w-px flex-1 bg-gradient-to-b from-transparent to-primary/25"></div>
            <div class="arrow-ring my-2 w-10 h-10 rounded-full bg-surface-container border border-primary/40 flex items-center justify-center shadow-xl shadow-primary/20 flex-shrink-0">
              <span class="material-symbols-outlined text-primary text-lg">arrow_forward</span>
            </div>
            <div class="w-px flex-1 bg-gradient-to-t from-transparent to-primary/25"></div>
          </div>

          <!-- AFTER: same wedding collage with studio watermark on each -->
          <div class="ex-after flex-1 relative overflow-hidden bg-gradient-to-br from-slate-950 to-violet-950/60">

            <!-- wedding.avif watermarked -->
            <div class="wedding-c1 absolute" style="top:6%;left:10%;width:68%;z-index:3;">
              <div class="rounded-2xl overflow-hidden shadow-2xl border border-primary/30 relative">
                <img src="/pictures/wedding.avif" alt="Wedding watermarked" class="w-full block" />
                <div class="wm-band wm-violet">
                  <template v-for="i in 40" :key="i">
                    <span>© Foto Estudio — Preview Only &nbsp;&nbsp;&nbsp;&nbsp;</span>
                  </template>
                </div>
              </div>
            </div>
            <!-- wedding2 watermarked -->
            <div class="wedding-c2 absolute" style="top:3%;right:2%;width:44%;z-index:2;">
              <div class="rounded-2xl overflow-hidden shadow-2xl border border-primary/30 relative">
                <img src="/pictures/wedding2.jpeg" alt="Wedding 2 watermarked" class="w-full block" />
                <div class="wm-band wm-violet">
                  <template v-for="i in 40" :key="i">
                    <span>© Foto Estudio &nbsp;&nbsp;&nbsp;&nbsp;</span>
                  </template>
                </div>
              </div>
            </div>
            <!-- wedding3 watermarked -->
            <div class="wedding-c3 absolute" style="bottom:10%;left:14%;width:66%;z-index:1;">
              <div class="rounded-2xl overflow-hidden shadow-2xl border border-primary/30 relative">
                <img src="/pictures/wedding3.webp" alt="Wedding 3 watermarked" class="w-full block" />
                <div class="wm-band wm-violet">
                  <template v-for="i in 40" :key="i">
                    <span>© Foto Estudio &nbsp;&nbsp;&nbsp;&nbsp;</span>
                  </template>
                </div>
              </div>
            </div>

            <span class="absolute top-4 left-4 card-tag card-tag-active" style="z-index:10">Watermarked</span>
          </div>
        </div>

        <div class="ex-desc py-12 md:py-16 px-6 text-center max-w-2xl mx-auto">
          <h3 class="text-xl md:text-3xl font-black mb-3">Photography Studio & Events</h3>
          <p class="text-sm md:text-base text-on-surface-variant leading-relaxed">Share wedding or event previews with your studio name tiled across each photo. Clients see the quality — clean files ship only once payment is confirmed.</p>
          <span class="inline-block mt-4 text-[10px] font-bold uppercase tracking-widest text-violet-400 border border-violet-400/30 px-4 py-2 rounded-full">Studio Watermark</span>
        </div>
      </div>

      <!-- ── EXAMPLE 3: Artwork preview / Content gate ── -->
      <div class="example-block border-t border-white/5">
        <div class="flex h-[55vh] md:h-[88vh]">

          <div class="ex-before flex-1 relative overflow-hidden">
            <img src="/pictures/monalisa.webp" alt="Artwork" class="ex-zoom-out w-full h-full object-cover object-top" />
            <span class="absolute top-4 left-4 card-tag">Original</span>
          </div>

          <div class="ex-arrow w-12 md:w-16 flex-shrink-0 flex flex-col items-center justify-center z-10 bg-background">
            <div class="w-px flex-1 bg-gradient-to-b from-transparent to-primary/25"></div>
            <div class="arrow-ring my-2 w-10 h-10 rounded-full bg-surface-container border border-primary/40 flex items-center justify-center shadow-xl shadow-primary/20 flex-shrink-0">
              <span class="material-symbols-outlined text-primary text-lg">arrow_forward</span>
            </div>
            <div class="w-px flex-1 bg-gradient-to-t from-transparent to-primary/25"></div>
          </div>

          <div class="ex-after flex-1 relative overflow-hidden">
            <img src="/pictures/monalisa.webp" alt="Artwork locked" class="ex-zoom-in w-full h-full object-cover object-top" />
            <div class="absolute bottom-0 left-0 right-0 h-[50%] pointer-events-none" style="background:linear-gradient(to top,rgba(5,5,10,0.96) 50%,transparent);">
              <div class="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pb-10 gap-3">
                <div class="w-12 h-12 rounded-full bg-amber-400/15 border border-amber-400/30 flex items-center justify-center">
                  <span class="material-symbols-outlined text-amber-400 text-2xl">lock</span>
                </div>
                <span class="text-xs font-black text-amber-300/70 tracking-[0.2em] uppercase select-none">Purchase to unlock full artwork</span>
              </div>
            </div>
            <span class="absolute top-4 left-4 card-tag card-tag-active">Watermarked</span>
          </div>
        </div>

        <div class="ex-desc py-12 md:py-16 px-6 text-center max-w-2xl mx-auto">
          <h3 class="text-xl md:text-3xl font-black mb-3">Preview Without Full Access</h3>
          <p class="text-sm md:text-base text-on-surface-variant leading-relaxed">Cover the lower portion of a painting, book, or document. Viewers see enough to decide — the full content stays protected behind a purchase or subscription.</p>
          <span class="inline-block mt-4 text-[10px] font-bold uppercase tracking-widest text-amber-400 border border-amber-400/30 px-4 py-2 rounded-full">Content Gate</span>
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
const { t, locale, setLocale, locales } = useI18n()

useHead({
  title: 'MarkShield - Professional Watermark Studio',
  meta: [
    { name: 'description', content: 'Add beautiful, customizable watermarks to your photos, artwork, and documents. 100% private, browser-based.' }
  ]
})
</script>

<style scoped>
/* ── Hero fade-in ── */
.animate-fade-in {
  animation: fadeIn 1s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Card labels ── */
.card-tag {
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(6px);
  color: rgba(255,255,255,0.5);
}
.card-tag-active {
  background: rgba(99,102,241,0.18);
  color: #818cf8;
}

/* ── Dot-grid background texture ── */
.dot-grid {
  background-image: radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px);
  background-size: 28px 28px;
  pointer-events: none;
}

/* ─────────────────────────────────────────────────
   Collage cards — CSS custom properties drive both
   the final resting rotation and the fly-in direction
   so a single @keyframes handles all three cards.
───────────────────────────────────────────────── */

/* Identity collage */
.collage-c1 { --rot: -5deg;  --fly-x:   0px;  --fly-y: -80px; }
.collage-c2 { --rot:  4deg;  --fly-x:  90px;  --fly-y:   0px; }
.collage-c3 { --rot: -2deg;  --fly-x: -60px;  --fly-y:  70px; }

/* Wedding collage */
.wedding-c1 { --rot: -2deg;  --fly-x:   0px;  --fly-y: -80px; }
.wedding-c2 { --rot:  5deg;  --fly-x:  90px;  --fly-y:   0px; }
.wedding-c3 { --rot:  3deg;  --fly-x: -60px;  --fly-y:  70px; }

/* Shared animation — staggered entry ranges */
.collage-c1, .collage-c2, .collage-c3,
.wedding-c1, .wedding-c2, .wedding-c3 {
  animation: collageFly linear both;
  animation-timeline: view();
}
.collage-c1, .wedding-c1 { animation-range: entry  0% entry 55%; }
.collage-c2, .wedding-c2 { animation-range: entry  9% entry 64%; }
.collage-c3, .wedding-c3 { animation-range: entry 18% entry 73%; }

@keyframes collageFly {
  from {
    opacity: 0;
    transform: translate(var(--fly-x), var(--fly-y)) rotate(var(--rot));
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translate(0, 0) rotate(var(--rot));
    filter: blur(0px);
  }
}

/* ── Watermark repeated-text band ──────────────────
   Centered at 50%/50% then expanded to 200%×200%
   so it always covers the full card at any screen
   size. The 40 text rows fill ~1 000 px height which
   exceeds the tallest card on any viewport.
─────────────────────────────────────────────────── */
.wm-band {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200%;
  height: 200%;
  transform: translate(-50%, -50%) rotate(-35deg);
  display: flex;
  flex-direction: column;
  gap: 16px;
  pointer-events: none;
  user-select: none;
  opacity: 0.7;
  overflow: hidden;
}
.wm-band span {
  flex-shrink: 0;
  font-size: 10px;
  font-weight: 900;
  color: rgba(20, 20, 100, 0.9);
  white-space: nowrap;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  /* Halo ensures legibility on light document backgrounds */
  text-shadow:
    0 0 6px rgba(255,255,255,1),
    0 1px 0  rgba(255,255,255,0.9),
    0 -1px 0 rgba(255,255,255,0.9);
}
/* Wedding — dark photos need light text + dark shadow */
.wm-violet span {
  color: rgba(230, 215, 255, 0.95);
  text-shadow:
    0 1px 5px rgba(0,0,0,1),
    0 0 14px rgba(0,0,0,0.8);
}

/* ─────────────────────────────────────────────────
   Scroll-driven animations — view() references the
   main page scroll (window) since there is no inner
   scroll container.
───────────────────────────────────────────────── */

/* Entrance: before panel slides from left */
.ex-before {
  animation: slideFromLeft linear both;
  animation-timeline: view();
  animation-range: entry 5% entry 65%;
}

/* Entrance: after panel slides from right */
.ex-after {
  animation: slideFromRight linear both;
  animation-timeline: view();
  animation-range: entry 10% entry 70%;
}

/* Entrance: arrow bridge pops in */
.ex-arrow {
  animation: popIn linear both;
  animation-timeline: view();
  animation-range: entry 8% entry 55%;
}

/* Entrance: caption fades up */
.ex-desc {
  animation: fadeUp linear both;
  animation-timeline: view();
  animation-range: entry 30% exit 5%;
}

/* Scroll-driven zoom on the <img> / inner div — tied to view progress.
   Before (left): starts slightly zoomed in, settles to normal/smaller.
   After  (right): starts slightly zoomed out, grows as element centers. */
.ex-zoom-out {
  animation: zoomOut linear both;
  animation-timeline: view();
  animation-range: entry 0% exit 100%;
}
.ex-zoom-in {
  animation: zoomIn linear both;
  animation-timeline: view();
  animation-range: entry 0% exit 100%;
}

@keyframes slideFromLeft {
  from { opacity: 0; transform: translateX(-80px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes slideFromRight {
  from { opacity: 0; transform: translateX(80px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes popIn {
  from { opacity: 0; transform: scale(0.2); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes zoomOut {
  from { transform: scale(1.1); }
  to   { transform: scale(0.95); }
}
@keyframes zoomIn {
  from { transform: scale(0.95); }
  to   { transform: scale(1.1); }
}

/* Arrow pulse */
.arrow-ring {
  animation: arrowPulse 2.4s ease-in-out infinite;
}
@keyframes arrowPulse {
  0%, 100% { transform: scale(1);    box-shadow: 0 0 0 0   rgba(99,102,241,0.3); }
  50%       { transform: scale(1.1); box-shadow: 0 0 0 12px rgba(99,102,241,0);   }
}
</style>
