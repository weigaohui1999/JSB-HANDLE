<template>
  <div class="h-150 f-c-c flex-col">
    <n-avatar
      :src="userStore.headPicture"
      h-50
      w-50
      rounded-full
      fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
    />
    <span>{{ userStore.name }}</span>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store'
const userStore = useUserStore()
</script>
