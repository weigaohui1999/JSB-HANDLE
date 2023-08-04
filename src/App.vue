<template>
  <AppProvider>
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </AppProvider>
</template>

<script setup>
import AppProvider from '@/components/common/AppProvider.vue'
</script>

<style>
* {
  -moz-user-select: none; /* 禁用火狐浏览器中的图片选择 */
  -webkit-user-select: none; /* 禁用谷歌浏览器中的图片选择 */
  -ms-user-select: none; /* 禁用IE浏览器中的图片选择 */
  user-select: none; /* 禁用其他浏览器中的图片选择 */
  -webkit-user-drag: none;
}
</style>
