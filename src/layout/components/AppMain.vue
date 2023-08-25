<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive :include="[keepAliveNames]">
      <component :is="Component" :key="route.fullPath" />
    </keep-alive>
  </router-view>
</template>

<script setup>
// import { useRoute } from 'vue-router'
import * as tagStore from '@/store/modules/tags/helpers'
// const route = useRoute()

const keepAliveNames = computed(() => {
  return ['CreateApply', 'TaskIndex', 'UserCenter', 'ApplyDetail']
})
</script>
