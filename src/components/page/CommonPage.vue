<template>
  <AppPage :show-footer="showFooter">
    <header v-if="showHeader" mb-15 min-h-45 flex items-center justify-between pr-24>
      <slot v-if="$slots.header" name="header" />
      <template v-else>
        <div w-150 flex items-center>
          <svg-icon
            v-if="route.meta?.customIcon || route.meta?.icon"
            mr-3xl
            text-22
            :icon="route.meta.customIcon"
          />
          <h2 text-22 font-normal text-hex-333>
            {{ title || route.meta?.title }}
          </h2>
        </div>
        <slot name="action" />
      </template>
    </header>

    <n-card flex-1>
      <slot />
    </n-card>
  </AppPage>
</template>

<script setup>
import SvgIcon from '@/components/icon/SvgIcon.vue'

defineProps({
  showFooter: {
    type: Boolean,
    default: false,
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: undefined,
  },
})
const route = useRoute()
</script>
