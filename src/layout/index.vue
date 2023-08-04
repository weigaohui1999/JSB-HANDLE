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
      <n-button
        ghost
        type="primary"
        size="medium"
        circle
        class="w-90%"
        style="position: relative; bottom: -100px; margin: 10px"
        title="退出登录"
        @click="logout"
      >
        <template #icon>
          <icon-custom-logout></icon-custom-logout>
        </template>
      </n-button>
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
const logout = () => {
  $dialog.confirm({
    title: '提示',
    type: 'info',
    content: '确认退出？',
    confirm() {
      userStore.logout()
      $message.success('已退出登录')
    },
  })
}
</script>
