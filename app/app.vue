<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const i18nHead = useLocaleHead({ addSeoAttributes: false })
useHead({
  htmlAttrs: computed(() => ({
    class: 'dark',
    lang: i18nHead.value?.htmlAttrs?.lang,
    dir: i18nHead.value?.htmlAttrs?.dir ?? 'ltr'
  }))
})
</script>
