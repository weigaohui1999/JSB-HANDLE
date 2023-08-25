<template>
  <n-upload
    ref="upload"
    v-model:file-list="fileArr"
    :custom-request="handleUpload"
    :disabled="disabled"
    :max="number"
    accept=".png,.jpg,.jpeg"
    list-type="image-card"
    @before-upload="onBeforeUpload"
    @preview="handlePreview"
    @remove="handleRemove"
  />
  <n-modal v-model:show="showModal" preset="card" style="width: 600px" title="一张很酷的图片">
    <img :src="previewImageUrl" style="width: 100%" />
  </n-modal>
</template>

<script setup>
import api from '@/api'
defineOptions({ name: 'Upload' })
defineExpose({
  handUpdateFileList,
  handleRemoveFileList,
})
const props = defineProps({
  number: {
    type: Number,
    default: 1,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  value: {},
})
const emit = defineEmits(['update:value'])

const showModal = ref(false)
const upload = ref(null)
const fileArr = ref([])
const previewImageUrl = ref('')

function onBeforeUpload({ file }) {
  if (!file.file?.type.startsWith('image/')) {
    $message.error('只能上传图片')
    return false
  }
  return true
}

function handleRemoveFileList() {
  fileArr.value = []
}

function handUpdateFileList(data) {
  let obj = []
  typeof data == 'object'
    ? data.forEach((item, index) => {
        obj.push({
          uid: index,
          name: item.slice(item.lastIndexOf('/') + 1),
          percentage: 100,
          status: 'finished',
          url: item,
        })
      })
    : (obj = [
        {
          uid: 0,
          name: data.slice(data.lastIndexOf('/') + 1),
          percentage: 100,
          status: 'finished',
          url: data,
        },
      ])
  fileArr.value = obj
}

function handlePreview(file) {
  const { url } = file
  previewImageUrl.value = url
  showModal.value = true
}

const handleUpload = async ({ file, onFinish }) => {
  if (!file || !file.type) {
    $message.error('请选择文件')
  }
  let formData = new FormData()
  formData.append('file', file.file)

  let length = fileArr.value.length - 1

  const res = await api.upload(formData)
  if (res && res.code == 200) {
    fileArr.value[length].percentage = 100
    fileArr.value[length].status = 'finished'
    fileArr.value[length].url = res.data
    console.log(fileArr.value)
    $message.success('上传成功')
    updateFileList()
    onFinish()
  } else {
    fileArr.value[length].status = 'error'
    $message.error('上传失败')
  }
}

function updateFileList() {
  let data = []
  fileArr.value.forEach((item) => {
    item.status === 'finished' ? data.push(item.url) : void 0
  })
  emit('update:value', props.number === 1 ? data[0] : data)
}

function handleRemove({ file, fileList }) {
  let key = fileList.findIndex((item) => item === file)
  return fileArr.value.splice(key, 1)
}
</script>
