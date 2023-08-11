<template>
  <n-upload
    ref="upload"
    :custom-request="handleUpload"
    :default-file-list="fileList"
    accept=".png,.jpg,.jpeg"
    list-type="image-card"
    @before-upload="onBeforeUpload"
    :max="number"
    @preview="handlePreview"
    :disabled="disabled"
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
const fileList = ref([])
const previewImageUrl = ref('')

function onBeforeUpload({ file }) {
  if (!file.file?.type.startsWith('image/')) {
    $message.error('只能上传图片')
    return false
  }
  return true
}

function handleRemoveFileList() {
  fileList.value = []
}

function handUpdateFileList(data) {
  let obj = []
  typeof data == 'object'
    ? data.forEach((item, index) => {
        obj.push({
          id: index,
          name: item.slice(item.lastIndexOf('/') + 1),
          percent: 100,
          status: 'success',
          url: item,
        })
      })
    : (obj = [
        {
          uid: 0,
          name: data.slice(data.lastIndexOf('/') + 1),
          percent: 100,
          status: 'success',
          url: data,
        },
      ])
  fileList.value = obj
}

function handlePreview() {
  const { url } = file
  previewImageUrl.value = url
  showModal.value = true
}

async function handleUpload({ file, onFinish }) {
  if (!file || !file.type) {
    $message.error('请选择文件')
  }

  // 模拟上传
  $message.loading('上传中...')
  let formData = new FormData()
  formData.append('file', file)

  let length = fileList.value.length
  let fileItem = {
    id: file.uid,
    name: file.name,
    percentage: 0,
    status: 'uploading',
    url: '',
  }
  //  预上传 开始占位标识
  fileList.value.push(fileItem)
  const res = await api.upload(formData)
  if (res && res.code == 200) {
    fileList.value[length].percentage = 100
    fileList.value[length].status = 'finished'
    fileList.value[length].url = res.data
    $message.success('上传成功')
    onFinish()
  } else {
    $message.error('上传失败')
  }
}

watch(
  () => fileList,
  (n, o) => {
    console.log(n)
    console.log(o)
    let data = []
    n.forEach((item) => {
      item.status === 'finished' ? data.push(item.url) : void 0
    })
    emit('update:value', props.number === 1 ? data[0] : data)
  },
  { deep: true }
)
</script>
