import { defineStore } from 'pinia'
import { resetRouter } from '@/router'
import { useTagsStore, usePermissionStore } from '@/store'
import { sStorage, removeToken, toLogin, lStorage } from '@/utils'

export const useUserStore = defineStore('user', {
  state() {
    return {
      userInfo: {},
      userId: lStorage.get('id'),
      name: lStorage.get('name'),
      headPicture: lStorage.get('headPicture'),
      role: []
    }
  },
  getters: {

  },
  actions: {
    async getUserInfo(res) {
      try {
        const { id, name, headPicture, role } = res.data
        lStorage.set('id', id)
        lStorage.set('name', name)
        lStorage.set('headPicture', headPicture)
        lStorage.set('role', role)
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
      sStorage.clear()
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
