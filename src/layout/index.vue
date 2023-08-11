<template>
  <n-layout has-sider wh-full>
    <n-layout-sider
      class="bg-[#f5f6fb]"
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="220"
      :native-scrollbar="false"
      :collapsed="appStore.collapsed"
    >
      <SideBar />
    </n-layout-sider>
    <article flex-col flex-1 overflow-hidden>
      <section flex-1 overflow-hidden bg-hex-ffffff>
        <AppMain />
      </section>
    </article>
  </n-layout>
</template>

<script setup>
import SideBar from './components/sidebar/index.vue'
import AppMain from './components/AppMain.vue'
import { useAppStore, useUserStore } from '@/store'
const title = import.meta.env.VITE_TITLE

const appStore = useAppStore()
const userStore = useUserStore()
</script>
