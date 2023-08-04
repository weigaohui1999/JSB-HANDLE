<template>
  <Keep-alive :include="[keepAliveNames]">
    <router-view v-slot="{ Component, route }">
      <component :is="Component" :key="route.fullPath" />
    </router-view>
  </Keep-alive>
</template>

<script setup>
// import { useRoute } from 'vue-router'
import * as tagStore from '@/store/modules/tags/helpers'
// const route = useRoute()

const keepAliveNames = computed(() => {
//   return tagStore.tags.filter((item) => item.keepAlive).map((item) => item.name)
})
</script>
