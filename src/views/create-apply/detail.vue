<template>
  <CommonPage show-footer title="事项详情">
    <div v-if="!isEmpty">
      <n-descriptions
        label-placement="left"
        :label-style="{ 'font-weight': 'bold', 'font-size': '16px' }"
        mb-15px
      >
        <template #header>
          <n-select
            v-model:value="itemId"
            :show-arrow="false"
            w-auto
            filterable
            :render-option="renderOption"
            label-field="name"
            value-field="id"
            placeholder="选择要切换的事项"
            :options="itemOptions"
            @update:value="getApplyDetail"
          ></n-select>
        </template>
        <n-descriptions-item label="办件编码">
          {{ itemDetail?.code }}
        </n-descriptions-item>
        <n-descriptions-item label="办件类型">
          {{ itemTypeFilter(itemDetail?.itemType) }}
        </n-descriptions-item>
        <n-descriptions-item label="办理方式">
          {{ itemDetail?.transactType === 1 ? '承诺件' : '即办件' }}
        </n-descriptions-item>
        <n-descriptions-item label="申报对象">
          {{ workObjectFilter(itemDetail?.workObject) }}
        </n-descriptions-item>
        <n-descriptions-item label="是否收费">
          {{ itemDetail?.isCharge === 0 ? '否' : '是' }}
        </n-descriptions-item>
      </n-descriptions>

      <n-descriptions
        title="办件介绍"
        :column="1"
        mb-15px
        label-placement="left"
        :label-style="{ 'font-weight': 'bold', 'font-size': '16px' }"
      >
        <n-descriptions-item label="办件说明">
          {{ itemDetail?.description }}
        </n-descriptions-item>
        <n-descriptions-item label="收费说明">
          {{ itemDetail?.chargeDescription || '暂未提供明细' }}
        </n-descriptions-item>
      </n-descriptions>

      <n-descriptions
        title="部门介绍"
        :column="1"
        mb-15px
        label-placement="left"
        :label-style="{ 'font-weight': 'bold', 'font-size': '16px' }"
      >
        <n-descriptions-item label="部门名称">
          {{ itemDetail.department?.name }}
        </n-descriptions-item>
        <n-descriptions-item label="部门介绍">
          {{ itemDetail?.department?.description || '暂未提供' }}
        </n-descriptions-item>
      </n-descriptions>

      <n-descriptions title="办件材料" :column="1" mb-15px separator="" label-placement="left">
        <n-descriptions-item
          :label="`${idx + 1}. ${i.name}`"
          v-for="(i, idx) in itemDetail?.materialsList"
          v-if="itemDetail.materialsList?.length"
        ></n-descriptions-item>
        <n-descriptions-item label="暂无数据" v-else></n-descriptions-item>
      </n-descriptions>

      <div class="mt-25px f-c-c">
        <n-button round mr-15px @click="backList">返回列表</n-button>
        <n-button round mr-15px type="primary" @click="toApply">在线办理</n-button>
      </div>
    </div>
    <n-empty h-full f-c-c v-else :show-description="false" :show-icon="false">
      <template #extra>
        <div class="table-empty w-e-full-screen-container">
          <img src="@/assets/images/empty.gif" />
        </div>
      </template>
    </n-empty>
  </CommonPage>
</template>

<script setup>
import api from './api'
import { itemType, workObject } from '@/utils/auth/dict'
import { lStorage } from '@/utils'
import { NTooltip } from 'naive-ui'
defineOptions({ name: 'ApplyDetail' })

const route = useRoute()
const router = useRouter()
const itemDetail = ref({})
const itemId = ref(null)
const itemOptions = ref([])
const isEmpty = ref(false)
const isShow = ref(true)
const itemTypeList = itemType
const workObjectList = workObject

function renderOption({ node, option }) {
  return h(NTooltip, null, {
    trigger: node,
    default: () => option.name,
  })
}
async function getApplyDetail() {
  try {
    isEmpty.value = true
    const res = await api.getApplyDetail(itemId.value)
    if (res && res.code === 200) {
      itemDetail.value = res.data
    }
  } catch (e) {
    new Error(e)
  } finally {
    isEmpty.value = false
  }
}

async function getItemList() {
  try {
    const res = await api.getItemList()
    if (res && res.code === 200) {
      itemOptions.value = res.data
    }
  } catch (e) {
    new Error(e)
  }
}

function toApply() {
  if (itemDetail.value.materialsList) {
    lStorage.set('materialsList', itemDetail.value.materialsList || [])
  }
  router.push({
    path: `/create-apply/apply/${itemId.value}`,
    query: { deptId: itemDetail.value.departmentId },
  })
}
function backList() {
  router.push(`/create-apply/index`)
}

function itemTypeFilter(value) {
  return itemTypeList.find((v) => v.value === value)?.label || ''
}

function workObjectFilter(value) {
  return workObjectList.find((v) => v.value === value)?.label || ''
}

onMounted(() => {
  if (route.params?.id) {
    itemId.value = +route.params.id
    getItemList()
    getApplyDetail()
  } else {
    $message.error('未获取到事项!')
  }
})
</script>

<style lang="scss" scoped>
:deep(.n-icon svg) {
  height: 1em;
  width: 1em;
  position: absolute;
  top: 3px;
  left: 0;
}

:deep(.n-descriptions-header) {
  color: var(--primary-color);
  font-size: 20px;
  display: flex;
  &::before {
    transform: translate(0, 37%);
  }
}

.b-1 {
  border-color: var(--primary-color);
}
</style>
