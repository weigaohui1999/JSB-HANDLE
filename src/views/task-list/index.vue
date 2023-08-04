<template>
  <CommonPage show-footer title="任务列表">
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :extra-params="extraParams"
      :scroll-x="1200"
      :columns="columns"
      :get-data="api.getPage"
      @on-data-change="(data) => (tableData = data)"
    >
      <template #queryBar>
        <QueryBarItem label="任务状态" :label-width="80">
          <n-select
            v-model:value="queryItems.status"
            type="text"
            clearable
            placeholder="请选择任务状态"
            :options="statusOptions"
            @update:value="$table?.handleSearch"
          />
        </QueryBarItem>
      </template>
    </CrudTable>
    <CrudModal
      v-model:visible="modalVisible"
      title="受理业务"
      width="800px"
      :loading="modalLoading"
      :show-footer="false"
      @on-save="handleSave"
      @on-cancel="handleCancel"
    >
      <template #header-extra>
        <n-button circle class="h-22px w-22px" type="success" title="清空" @click="handleClean">
          <n-icon :size="18" :component="Delete16Regular" />
        </n-button>
        <n-button
          circle
          ml-10
          class="h-22px w-22px"
          :loading="modalLoading"
          type="primary"
          title="提交"
          @click="handleSave"
        >
          <n-icon :size="18" :component="Checkmark16Filled" />
        </n-button>
      </template>
      <n-space vertical>
        <n-spin :show="modalLoading">
          <div class="bg-transparent">签字区域</div>
          <VueSignaturePad ref="signaturePad" class="w-full bg-#f5f2f2" height="450px" />
          <template #description>正在加载中...</template>
        </n-spin>
      </n-space>
    </CrudModal>
  </CommonPage>
</template>

<script setup>
import { NButton, NTag } from 'naive-ui'
import { useCRUD } from '@/composables'
import api from './api'
import CrudModal from '@/components/table/CrudModal.vue'
import Checkmark16Filled from '@vicons/fluent/Checkmark16Filled'
import Delete16Regular from '@vicons/fluent/Delete16Regular'
import { dataURItoBlob } from '@/utils'
import { status } from '@/utils/auth/dict'

defineOptions({ name: 'TaskIndex' })

const $table = ref(null)
const signaturePad = ref(null)

/** 表格数据，触发搜索的时候会更新这个值 */
const tableData = ref([])
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
/** 补充参数（可选） */
const extraParams = ref({})
const modalVisible = ref(false)
const modalLoading = ref(false)
const number = ref(null)
const detail = ref({})
const router = useRouter()

const statusOptions = status

onMounted(() => {
  $table.value?.handleSearch()
})

function handleSeeDetail(n) {
  router.push(`/task-list/detail/${n}`)
}

function handleAcceptanceBusiness(n) {
  modalVisible.value = true
  number.value = n
}

async function handleSave() {
  const { isEmpty, data } = signaturePad.value.saveSignature()
  if (isEmpty) return $message.warning('请绘制签名之后才能提交!')
  modalLoading.value = true
  const blob = dataURItoBlob(data)
  const fd = new FormData()
  fd.append('file', blob)
  fd.append('number', number.value)
  passAudit(fd)
  $table.value?.handleSearch()
}

async function passAudit(fd) {
  try {
    const res = await api.passAudit(fd)
    if (res.code && res.code == 200) {
      $message.success(res.message)
      handleCancel()
    } else {
      $message.warning(res.message)
    }
  } catch (e) {
    new Error(e)
  } finally {
    modalLoading.value = false
  }
}

function handleClean() {
  signaturePad.value.undoSignature()
}

function handleCancel() {
  modalVisible.value = false
  modalLoading.value = false
  number.value = null
  detail.value = null
  handleClean()
}

const columns = [
  { title: '委托人', key: 'name', width: 80, ellipsis: { tooltip: true } },
  { title: '事项名称', key: 'itemName', width: 250, ellipsis: { tooltip: true } },
  {
    title: '创建时间',
    key: 'createTime',
    width: 200,
  },
  {
    title: '状态',
    width: 200,
    hideInExcel: true,
    render(row) {
      return [
        h(
          NTag,
          {
            bordered: false,
            type: statusOptions[row?.status - 1]?.type,
            style: { 'border-radius': '10px 20px' },
          },
          { default: () => statusOptions[row?.status - 1]?.label }
        ),
      ]
    },
  },
  {
    title: '操作',
    key: 'actions',
    width: 240,
    align: 'center',
    fixed: 'right',
    hideInExcel: true,
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            secondary: true,
            round: true,
            onClick: () => handleSeeDetail(row.id),
          },
          { default: () => '查看详情' }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'success',
            round: true,
            style: 'margin-left: 15px;',
            disabled: row.status !== 1,
            onClick: () => handleAcceptanceBusiness(row.number),
          },
          {
            default: () => '受理业务',
          }
        ),
      ]
    },
  },
]

const { handleAdd } = useCRUD({
  name: '任务列表',
  initForm: { author: '大脸怪' },
  refresh: () => $table.value?.handleSearch(),
})
</script>
<style scoped lang="scss">
.bg-transparent {
  position: absolute;
  top: 50%;
  left: 50%;
  opacity: 0.5;
  -moz-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  transform: translate(-50%, -50%);
}
</style>
