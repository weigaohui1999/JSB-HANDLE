<template>
  <AppPage :show-footer="showFooter">
    <header v-if="showHeader" mb-15 min-h-45 flex items-center justify-between pr-24>
      <slot v-if="$slots.header" name="header" />
      <template v-else>
        <div w-200 flex items-center>
          <svg-icon
            v-if="route.meta?.customIcon || route.meta?.icon"
            mr-3xl
            text-22
            :icon="route.meta.customIcon"
          />
          <h2 text-22 font-normal text-hex-333>
            {{ title || route.meta?.title }}
          </h2>
          <n-icon size="18" ml-3xl title="返回上一页" style="cursor: pointer;">
            <ArrowBackCircleOutline @click="back" />
          </n-icon>
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
import { ArrowBackCircleOutline } from '@vicons/ionicons5'

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
const router = useRouter()

function back() {
  router.go(-1)
}
</script>
