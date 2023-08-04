<template>
  <div class="h-150 f-c-c flex-col">
    <n-avatar
      :src="userStore.headPicture"
      h-50
      w-50
      rounded-full
      fallback-src="http://114.116.73.148:8086/c-file/64798763e4b062a16a0b4810.jpg"
    />
    <span>{{ userStore.name }}</span>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store'
const userStore = useUserStore()
</script>
