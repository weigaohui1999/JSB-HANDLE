<template>
  <CommonPage show-footer title="个人中心">
    <n-tabs type="card" animated h-full pane-class="max-w-500px mx-auto pt-20px!">
      <n-tab-pane name="1" tab="信息更新">
        <n-space vertical>
          <n-spin :show="modalLoading">
            <n-form
              ref="formRef"
              :model="data.userDetail"
              label-placement="left"
              label-width="auto"
              :disabled="disabled"
              require-mark-placement="right-hanging"
              size="medium"
            >
              <n-form-item
                label="姓名"
                path="name"
                :rule="{
                  required: true,
                  message: '请输入姓名',
                  trigger: ['input', 'blur'],
                }"
              >
                <n-input
                  v-model:value="data.userDetail.name"
                  placeholder="请输入姓名"
                  round
                  clearable
                />
              </n-form-item>
              <n-form-item
                label="登录名"
                path="account"
                :rule="{
                  required: true,
                  message: '请输入登录名',
                  trigger: ['input', 'blur'],
                }"
              >
                <n-input
                  v-model:value="data.userDetail.account"
                  placeholder="请输入登录名"
                  round
                  clearable
                />
              </n-form-item>
              <n-form-item label="头像" path="headPicture">
                <my-upload
                  ref="upload"
                  v-model:value="data.userDetail.headPicture"
                  :disabled="disabled"
                />
              </n-form-item>
              <n-form-item label="性别" path="sex">
                <n-radio-group v-model:value="data.userDetail.sex">
                  <n-space>
                    <n-radio :value="1">男</n-radio>
                    <n-radio :value="0">女</n-radio>
                  </n-space>
                </n-radio-group>
              </n-form-item>
              <n-form-item
                label="手机号"
                path="phone"
                :rule="{
                  required: true,
                  message: '请输入手机号',
                  trigger: ['input', 'blur'],
                }"
              >
                <n-input
                  v-model:value="data.userDetail.phone"
                  placeholder="请输入手机号"
                  round
                  clearable
                />
              </n-form-item>
              <n-form-item
                label="身份证号"
                path="idCard"
                :rule="{
                  required: true,
                  message: '请输入身份证号',
                  trigger: ['input', 'blur'],
                }"
              >
                <n-input
                  v-model:value="data.userDetail.idCard"
                  placeholder="请输入身份证号"
                  round
                  clearable
                />
              </n-form-item>
              <n-form-item
                label="出生日期"
                path="birthday"
                :rule="{
                  type: 'date',
                  required: true,
                  message: '请选择出生日期',
                  trigger: ['blur', 'change'],
                }"
              >
                <n-date-picker
                  v-model:formatted-value="data.userDetail.birthday"
                  type="date"
                  placeholder="请选择出生日期"
                  class="w-full"
                  clearable
                />
              </n-form-item>
              <n-form-item
                label="所属部门"
                path="departmentId"
                :rule="{
                  type: 'number',
                  required: true,
                  message: '请选择所属部门',
                  trigger: ['blur', 'change'],
                }"
              >
                <n-select
                  v-model:value="data.userDetail.departmentId"
                  placeholder="请选择所属部门"
                  label-field="name"
                  value-field="id"
                  clearable
                  :options="department"
                />
              </n-form-item>
              <div f-c-c mt-50>
                <n-button round ghost type="primary" @click="disabled = !disabled" mr-20>
                  {{ disabled ? '修改' : '取消' }}
                </n-button>
                <n-button
                  round
                  type="primary"
                  @click="handleValidateButtonClick"
                  :disabled="disabled"
                  :loading="modalLoading"
                >
                  提交
                </n-button>
              </div>
            </n-form>
            <template #description>正在加载中...</template>
          </n-spin>
        </n-space>
      </n-tab-pane>
      <n-tab-pane name="2" tab="修改密码">
        <n-space vertical>
          <n-spin :show="modalLoading">
            <n-form
              ref="userPasswordRef"
              :model="userPassword"
              label-placement="left"
              label-width="auto"
              :rules="userPasswordRules"
              mt-100
              require-mark-placement="right-hanging"
              size="medium"
            >
              <n-form-item label="旧密码" path="oldPw">
                <n-input
                  v-model:value="userPassword.oldPw"
                  placeholder="请输入旧密码"
                  round
                  show-password-on="mousedown"
                  type="password"
                  clearable
                />
              </n-form-item>
              <n-form-item label="新密码" path="newPw">
                <n-input
                  v-model:value="userPassword.newPw"
                  placeholder="请输入新密码"
                  round
                  show-password-on="mousedown"
                  type="password"
                  clearable
                />
              </n-form-item>
              <div f-c-c mt-50>
                <n-button
                  round
                  type="primary"
                  @click="handleUpdatePassword"
                  :loading="modalLoading"
                >
                  提交修改
                </n-button>
              </div>
            </n-form>
          </n-spin>
        </n-space>
      </n-tab-pane>
    </n-tabs>
  </CommonPage>
</template>

<script setup>
import { lStorage } from '@/utils'
import MyUpload from '@/components/upload/index.vue'
import api from './api'
import { useUserStore } from '@/store'
import qs from 'qs'

defineOptions({ name: 'UserCenter' })
const userId = lStorage.get('id')
const userStore = useUserStore()
const modalLoading = ref(false)
const userPassword = ref({})
const formRef = ref(null)
const userPasswordRef = ref(null)
const upload = ref(null)
const disabled = ref(true)
const department = ref([])
const data = reactive({
  userDetail: {},
})

function validatePasswordStartWith(rule, value) {
  if (value === userPassword.value.oldPw) return false
}

const userPasswordRules = {
  oldPw: [
    {
      required: true,
      message: '请输入旧密码',
      trigger: ['input', 'blur'],
    },
  ],
  newPw: [
    {
      required: true,
      message: '请输入新密码',
      trigger: ['input', 'blur'],
    },
    {
      validator: validatePasswordStartWith,
      message: '两次密码不能一致',
      trigger: ['blur', 'password-input'],
    },
  ],
}

async function getCommossionDetail() {
  try {
    modalLoading.value = true
    const res = await api.getCommossionDetail(userId)
    if (res && res.code == 200) {
      data.userDetail = res.data
      upload.value.handUpdateFileList(data.userDetail['headPicture'])
      const { name, headPicture } = res.data
      lStorage.set('name', name)
      userStore.name = name
      lStorage.set('headPicture', headPicture)
      userStore.headPicture = headPicture
    } else {
      $message.warning(res.message)
    }
  } catch (e) {
    new Error(e)
  } finally {
    modalLoading.value = false
  }
}

async function getDepartmentList() {
  try {
    const res = await api.getDepartmentList()
    if (res && res.code == 200) {
      department.value = res.data
    } else {
      $message.warning(res.message)
    }
  } catch (e) {
    new Error(e)
  }
}

async function handleValidateButtonClick(e) {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      modalLoading.value = true
      const res = await api.updateUserinfo(data.userDetail)
      if (res && res.code === 200) {
        $message.success('修改成功')
        await getCommossionDetail()
        disabled.value = true
      }
    } else {
      $message.error('修改失败')
    }
    modalLoading.value = false
  })
}

function handleUpdatePassword(e) {
  e.preventDefault()
  userPasswordRef.value?.validate(async (errors) => {
    if (!errors) {
      modalLoading.value = true
      const res = await api.updatePwd(qs.stringify(userPassword.value))
      if (res && res.code === 200) {
        $message.success('修改成功')
        userStore.logout()
      }
    } else {
      $message.error('修改失败')
    }
    modalLoading.value = false
  })
}

onMounted(() => {
  getDepartmentList()
  getCommossionDetail()
})
</script>

<style scoped lang="scss"></style>
