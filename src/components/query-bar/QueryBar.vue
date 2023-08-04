<template>
  <div min-h-60 flex items-start justify-between py-15>
    <n-space wrap :size="[35, 15]">
      <slot />
    </n-space>

    <div flex-shrink-0>
      <n-button secondary type="primary" @click="emit('reset')">重置</n-button>
      <n-button ml-20 type="primary" @click="emit('search')">搜索</n-button>
      <n-button dashed ml-20 type="primary" @click="emit('export')">导出</n-button>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['search', 'reset'])
</script>
