import { defineStore } from 'pinia'
import { resetRouter } from '@/router'
import { useTagsStore, usePermissionStore } from '@/store'
import { lStorage, removeToken, toLogin } from '@/utils'

export const useUserStore = defineStore('user', {
  state() {
    return {
      userInfo: {},
    }
  },
  getters: {
    userId() {
      return lStorage.get('userinfo')?.id
    },
    name() {
      return lStorage.get('userinfo')?.name
    },
    headPicture() {
      return lStorage.get('userinfo')?.headPicture
    },
    role() {
      return this.userInfo?.role || []
    },
  },
  actions: {
    async getUserInfo(res) {
      try {
        // const { id, name, headPicture, role } = res.data
        lStorage.set('userinfo', res.data)
        // this.userInfo = { id, name, headPicture, role }
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async logout() {
      const { resetTags } = useTagsStore()
      const { resetPermission } = usePermissionStore()
      removeToken()
      this.removeUserinfo()
      resetTags()
      resetPermission()
      resetRouter()
      lStorage.clear()
      toLogin()
    },
    removeUserinfo() {
      lStorage.set('userinfo', [])
    },
    setUserInfo(userInfo = {}) {
      this.userInfo = { ...this.userInfo, ...userInfo }
    },
  },
})
