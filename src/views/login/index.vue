<template>
  <AppPage :show-footer="true" bg-cover :style="{ backgroundImage: `url(${bgImg})` }">
    <div
      style="transform: translateY(25px)"
      class="m-auto max-h-55.6% max-w-70% min-h-471 min-w-63% f-c-c bg-white bg-opacity-60 card-shadow"
    >
      <div class="min-w-50%" hidden h-full md:block>
        <img src="@/assets/images/login-banner.png" h-full w-full alt="login_banner" />
      </div>

      <div flex-c class="min-w-50% pl-150 pr-150 pt-8%" h-full>
        <h5 f-c-c text-24 font-normal color="#6a6a6a">
          <icon-custom-logo mr-10 text-25 color-primary />
          吉顺办中台系统
        </h5>
        <div mt-30>
          <n-input
            v-model:value="loginInfo.account"
            autofocus
            class="h-50 items-center pl-10 text-16"
            placeholder="请输入帮办人手机号"
            :maxlength="11"
          />
        </div>
        <div mt-30>
          <n-input
            v-model:value="loginInfo.password"
            class="h-50 items-center pl-10 text-16"
            type="password"
            show-password-on="mousedown"
            placeholder="请输入帮办人密码"
            :maxlength="20"
            @keypress.enter="handleLogin"
          />
        </div>

        <div mt-20>
          <n-button
            h-50
            w-full
            rounded-5
            text-16
            type="primary"
            :loading="loading"
            @click="handleLogin"
          >
            登录
          </n-button>
        </div>
      </div>
    </div>
  </AppPage>
</template>

<script setup>
import { setToken } from '@/utils'
import bgImg from '@/assets/images/login-bg.png'
import api from './api'
import { addDynamicRoutes } from '@/router'
import qs from 'qs'
import { useUserStore } from '@/store'

const title = import.meta.env.VITE_TITLE

const router = useRouter()
const { query } = useRoute()
const userStore = useUserStore()

const loginInfo = ref({
  account: '',
  password: '',
})

const loading = ref(false)
async function handleLogin() {
  const { account, password } = loginInfo.value
  if (!account || !password) {
    $message.warning('请输入手机号和密码')
    return
  }
  try {
    loading.value = true
    $message.loading('正在验证...')
    const res = await api.login(qs.stringify({ account, password: password.toString() }))
    $message.success('登录成功')
    setToken(res.data.token)
    await userStore.getUserInfo(res)
    await addDynamicRoutes()
    if (query.redirect) {
      const path = query.redirect
      Reflect.deleteProperty(query, 'redirect')
      router.push({ path, query })
    } else {
      router.push('/')
    }
  } catch (error) {
    console.error(error)
    $message.removeMessage()
  }
  loading.value = false
}
</script>
