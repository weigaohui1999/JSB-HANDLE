<template>
  <div flex-col style="position: absolute; top: 0; bottom: 0">
    <n-scrollbar style="max-height: 70vh">
      <SideLogo />
      <UserAvatar />
      <SideMenu />
    </n-scrollbar>
    <n-scrollbar style="max-height: 30vh">
      <TimeClock />
      <n-button
        type="primary"
        size="medium"
        quaternary
        circle
        class="w-90%"
        style="margin: 10px"
        title="退出登录"
        @click="logout"
      >
        <template #icon>
          <icon-custom-logout></icon-custom-logout>
        </template>
      </n-button>
    </n-scrollbar>
  </div>
</template>

<script setup>
import SideLogo from './components/SideLogo.vue'
import SideMenu from './components/SideMenu.vue'
import UserAvatar from '@/layout/components/header/components/UserAvatar.vue'
import TimeClock from '@/layout/components/header/components/TimeClock.vue'
import { useUserStore } from '@/store'

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

<style lang="scss" scoped></style>
