<template>
  <CommonPage show-footer title="业务申报">
    <div max-w-60vw mx-auto mt-18>
      <n-steps :current="current" :status="currentStatus">
        <template #finish-icon>
          <n-icon>
            <md-happy />
          </n-icon>
        </template>
        <n-step title="基本信息" description="委托人基本型以及代办人取件方式" />
        <n-step title="材料列表" description="代办事项所需材料" />
        <n-step title="委托书" description="确认委托签署" />
      </n-steps>
    </div>
    <div max-w-600px mx-auto my-auto mt-30>
      <div v-if="current === 1">
        <n-form ref="formRef" label-width="80" label-placement="left" :model="data.form">
          <n-form-item
            label="姓名"
            path="name"
            :rule="{
              required: true,
              message: '请输入姓名',
              trigger: ['input', 'blur'],
            }"
          >
            <n-input v-model:value="data.form.name" clearable round placeholder="输入姓名" />
          </n-form-item>
          <n-form-item label="性别" path="sex">
            <n-radio-group v-model:value="data.form.sex">
              <n-radio :value="1">男</n-radio>
              <n-radio :value="0">女</n-radio>
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
            <n-input v-model:value="data.form.phone" clearable round placeholder="输入手机号" />
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
            <n-input v-model:value="data.form.idCard" clearable round placeholder="输入身份证号" />
          </n-form-item>
          <n-form-item
            label="代办人员"
            path="commissionId"
            :rule="{
              required: true,
              trigger: ['blur', 'change'],
              validator: validatorCommission,
            }"
          >
            <n-select
              v-model:value="data.form.commissionId"
              label-field="name"
              value-field="id"
              clearable
              :options="CommossionPerson"
              @update:value="handleUpdateValue"
              placeholder="选择代办人员"
            />
          </n-form-item>
          <n-form-item label="领取方式" path="acquireType">
            <n-radio-group v-model:value="data.form.acquireType">
              <n-radio :value="1">邮寄</n-radio>
              <n-radio :value="0">自取</n-radio>
            </n-radio-group>
          </n-form-item>
          <div v-if="data.form.acquireType === 1">
            <n-form-item
              label="邮寄地址"
              path="address"
              :rule="{
                required: true,
                message: '请输入邮寄地址',
                trigger: ['input', 'blur'],
              }"
            >
              <n-input
                type="textarea"
                v-model:value="data.form.address"
                placeholder="输入邮寄地址"
                clearable
              />
            </n-form-item>
          </div>
          <div v-else>
            <n-form-item
              label="联系电话"
              path="acquirePhone"
              :rule="{
                required: true,
                message: '请输入联系电话',
                trigger: ['input', 'blur'],
              }"
            >
              <n-input
                readonly
                v-model:value="data.form.acquirePhone"
                clearable
                round
                placeholder="暂无数据"
              />
            </n-form-item>
            <n-form-item
              label="联系地址"
              path="acquireAddress"
              :rule="{
                required: true,
                message: '请输入联系地址',
                trigger: ['input', 'blur'],
              }"
            >
              <n-input
                readonly
                v-model:value="data.form.acquireAddress"
                clearable
                placeholder="暂无数据"
              />
            </n-form-item>
          </div>
        </n-form>
      </div>
      <div v-if="current === 2">
        <div v-if="materialsList.length && materialsList.length > 0">
          <n-form ref="materialFormRef" :model="data.material">
            <div v-for="(material, index) in materialsList" :key="index">
              <n-form-item
                :label="index + 1 + '.' + material.name"
                label-width="auto"
                :rule="{
                  required: true,
                  message: `请上传${material.name}的材料`,
                  trigger: ['change', 'blur'],
                }"
              >
                <n-upload
                  v-model:file-list="data.material[index].fileList"
                  :custom-request="(file) => customRequest(file, material)"
                  list-type="image"
                  show-download-button
                >
                  <n-button round ml-10px>上传文件</n-button>
                </n-upload>
              </n-form-item>
            </div>
          </n-form>
        </div>
        <div v-else class="table-empty w-e-full-screen-container flex justify-center">
          <img src="@/assets/images/empty.gif" />
        </div>
      </div>
      <div v-if="current === 3">
        <VueSignaturePad ref="signaturePad" class="bg-#f5f2f2" height="450px" />
      </div>
      <div flex justify-center mt-20px>
        <n-button @click="prev" round w-100px mr-10 v-if="current !== 1">上一步</n-button>
        <n-button @click="next" round w-100px mr-10 v-if="current !== 3" type="primary">
          下一步
        </n-button>
        <n-button @click="handleClean" round w-100px mr-10 v-if="current === 3">清除</n-button>
        <n-button @click="handleSave" round w-100px type="primary" v-if="current === 3">
          提交
        </n-button>
      </div>
    </div>
    <n-result status="success" title="提交成功" v-if="showModal">
      <template #footer>
        <n-button @click="backHome" type="primary">回到首页</n-button>
      </template>
    </n-result>
  </CommonPage>
</template>

<script setup>
import { dataURItoBlob, lStorage } from '@/utils'
import { MdHappy } from '@vicons/ionicons4'
import api from './api'
import uploadApi from '@/api/index'

const signaturePad = ref(null)
const showModal = ref(false)
const route = useRoute()
const router = useRouter()
const materialsList = ref([])
const CommossionPerson = ref([])
const current = ref(1)
const formRef = ref(null)
const materialFormRef = ref(null)
const data = reactive({
  form: {
    name: '',
    sex: 1,
    phone: '',
    idCard: '',
    commissionId: '',
    type: 1,
    acquireType: 1,
    acquirePhone: '',
    acquireAddress: '',
    itemId: route.params.id,
  },
  material: [],
})

function validatorCommission(rule, value) {
  if (!value) {
    return new Error('请选择代办员')
  } else {
    return true
  }
}

function next() {
  if (current.value === 1) {
    formRef.value?.validate((errors) => {
      if (!errors) {
        current.value++
      } else {
        console.error(errors)
      }
    })
  }
  if (current.value === 2) {
    for (let i = 0; i < data.material.length; i++) {
      if (data.material[i].fileList.length > 0) {
        console.log(111)
      } else {
        $message.warning('当前存在未上传文件！')
        return false
      }
    }
    current.value++
  }
}

function prev() {
  if (current.value > 0 && current.value < 4) {
    current.value--
  }
}

function handleUpdateValue(value, option) {
  if (option.phone) {
    data.form.acquirePhone = option.phone
  }
  if (option.address) {
    data.form.acquireAddress = option.address
  }
}

async function customRequest(file, item) {
  file.status = 'uploading'
  let formData = new FormData()
  formData.append('file', file.file.file)
  const res = await uploadApi.upload(formData)
  if (res && res.code === 200) {
    file.status = 'finished'
    file.url = res.data
    data.material.map((it) => {
      return it.fileList.map((i) => {
        if (file.file.id === i.id) {
          return (i.url = res.data)
        }
      })
    })
  } else {
    file.status = 'error'
  }
}

function handleClean() {
  signaturePad.value.undoSignature()
}

async function handleSave() {
  const { isEmpty, data: dataObj } = signaturePad.value.saveSignature()
  if (isEmpty) return $message.warning('请绘制签名之后才能提交!')

  // 处理文件
  filterMaterial()

  // 提交申请
  try {
    const materialsApplyLink = data.material.map((item) => {
      let obj = {}
      obj.materialsApplyLink = item.materialsApplyLink
      obj.materialsId = item.materialsId
      return obj
    })

    const res = await api.serviceApplyAdd({ ...data.form, materialsApplyLink })
    if (res && res.code === 200) {
      // 提交签署委托书
      await passAudit(dataObj, res.data)
    }
  } catch (e) {
    new Error(e)
  }
}

function filterMaterial() {
  data.material.map((it) => {
    let material = []
    it.fileList.map((i) => {
      material.push(i.url)
    })
    it.materialsApplyLink = material
  })
}
async function passAudit(data, number) {
  const blob = dataURItoBlob(data)
  const fd = new FormData()
  fd.append('file', blob)
  fd.append('number', number)
  try {
    const res = await api.passAudit(fd)
    if (res.code && res.code == 200) {
      showModal.value = true
      reset()
    } else {
      $message.warning(res.message)
    }
  } catch (e) {
    new Error(e)
  }
}

function reset() {
  handleClean()
  data.form = {}
  data.material = []
}

async function getCommossionPerson() {
  try {
    const res = await api.getCommossionPerson(route.params.id)
    if (res && res.code === 200) {
      CommossionPerson.value = res.data
    }
  } catch (e) {
    new Error(e)
  }
}

function initMaterial() {
  data.material = materialsList.value.map((item) => {
    let obj = {
      fileList: [],
      materialsApplyLink: [],
      materialsId: item.id,
    }
    return obj
  })
}

function backHome() {
  router.push('/create-apply/index')
}
onMounted(() => {
  materialsList.value = lStorage.get('materialsList')
  if (materialsList.value) {
    initMaterial()
  }
  getCommossionPerson()
})

onBeforeUnmount(() => {
  lStorage.set('materialsList', [])
})
</script>

<style lang="scss" scoped>
:deep(.n-result) {
  z-index: 9000;
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  background-color: rgba(31, 34, 37, 0.8);
  .n-result-icon {
    margin-top: 300px;
  }
  .n-result-header__title {
    color: #fff
  }
}
</style>
