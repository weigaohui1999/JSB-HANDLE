<template>
  <CommonPage show-footer title="任务详情">
    <n-space vertical>
      <n-spin :show="modalLoading">
        <!--   任务详情       -->
        <n-descriptions
          label-placement="left"
          :title="detail?.itemName"
          :label-style="{ 'font-weight': 'bold', 'font-size': '16px' }"
          class="has-bottom-line"
        >
          <n-descriptions-item>
            <template #label>
              <n-icon text-16 :component="People16Filled" />
              申请人
            </template>
            {{ detail?.name }}
          </n-descriptions-item>
          <n-descriptions-item>
            <template #label>
              <n-icon text-16 :component="BookNumber16Filled" />
              订单编号
            </template>
            {{ detail?.number }}
          </n-descriptions-item>
          <n-descriptions-item>
            <template #label>
              <n-icon text-16 :component="AccessTime20Filled" />
              创建时间
            </template>
            {{ detail?.createTime }}
          </n-descriptions-item>
          <n-descriptions-item>
            <template #label>
              <n-icon text-16 :component="ProductionCheckmark20Filled" />
              领取方式
            </template>
            {{ acquireTypeFilter[detail?.acquireType]?.label }}
          </n-descriptions-item>
          <n-descriptions-item>
            <template #label>
              <n-icon text-16 :component="HomePerson24Filled" />
              联系地址
            </template>
            {{ detail.acquireType == 0 ? detail.address : detail.acquireAddress }}
          </n-descriptions-item>
          <n-descriptions-item>
            <template #label>
              <n-icon text-16 :component="Status24Filled" />
              状态
            </template>
            {{ statusFilter[detail?.status - 1]?.label }}
          </n-descriptions-item>
        </n-descriptions>

        <!--   材料列表       -->
        <n-descriptions
          v-if="detail?.materialsServiceApplyList"
          label-placement="left"
          title="材料列表"
          separator=" "
          mt-15px
          :label-style="{ display: 'none' }"
          :content-style="{ width: '100%' }"
        >
          <n-descriptions-item label="">
            <n-scrollbar style="height: calc(100vh - 550px)">
              <n-list bordered clickable hoverable>
                <n-checkbox-group v-model:value="material" @update:value="checkMaterials">
                  <n-list-item v-for="(m, i) in detail?.materialsServiceApplyList" :key="i" py-0>
                    <n-thing content-style="margin-top: 0;">
                      <template #default>
                        <div class="flex justify-between">
                          <div>{{ m.materialsName }}</div>
                          <div>
                            <n-checkbox
                              v-if="detail.status == 1 || detail.status == 2"
                              :value="m.materialsId"
                            />
                          </div>
                        </div>
                      </template>
                    </n-thing>
                    <n-image
                      v-if="m.materialsApplyLink.length <= 1"
                      width="100"
                      class="b-1"
                      :src="m.materialsApplyLink[0]"
                    >
                      <template #placeholder>
                        <img h-100px w-150px b-1 src="@/assets/images/errImage.png" />
                      </template>
                    </n-image>
                    <n-image
                      v-for="(img, idx) in m.materialsApplyLink"
                      v-else
                      :key="idx"
                      width="100"
                      :src="img"
                      class="b-1"
                    >
                      <template #placeholder>
                        <img mr-10px h-100px w-150px b-1 src="@/assets/images/errImage.png" />
                      </template>
                    </n-image>
                  </n-list-item>
                </n-checkbox-group>
              </n-list>
            </n-scrollbar>
          </n-descriptions-item>
        </n-descriptions>
        <!--   退回详情    -->
        <n-descriptions
          v-if="detail?.status == 5"
          label-placement="left"
          title="退回详情"
          separator=" "
          mt-15px
          :content-style="{ width: '100%' }"
        >
          <n-descriptions-item>
            <template #label>
              <n-icon text-16 :component="AccessTime20Filled" />
              退回时间
            </template>
            {{ detail.causeModels[0].createTime }}
          </n-descriptions-item>
          <n-descriptions-item>
            <template #label>
              <n-icon text-16 :component="TextDescription20Filled" />
              退回描述
            </template>
            {{ detail.causeModels[0].cause }}
          </n-descriptions-item>
        </n-descriptions>
        <!--  退回描述  -->
        <n-descriptions
          v-if="material.length !== 0 && (detail.status == 1 || detail.status == 2)"
          label-placement="left"
          separator=" "
          mt-15px
          :content-style="{ width: '100%' }"
        >
          <template #header>
            退回原因填写
            <n-tag :bordered="false" ml-10px size="small" type="primary">
              请从上述材料列表中勾选材料
            </n-tag>
          </template>
          <n-descriptions-item>
            <template #label>
              <n-icon text-16 :component="TextDescription20Filled" />
              退回描述
            </template>
            <n-input
              v-model:value="backMaterials.cause"
              type="textarea"
              :allow-input="(value) => !value.startsWith(' ') && !value.endsWith(' ')"
              placeholder="请填写业务受理异常原因！"
            />
          </n-descriptions-item>
        </n-descriptions>
      </n-spin>
    </n-space>
    <div class="mt-25px f-c-c">
      <n-button
        v-if="detail.status == 1 || detail.status == 2"
        :disabled="material.length === 0"
        round
        mr-15px
        type="success"
        @click="backMaterial"
      >
        材料退回
      </n-button>
      <n-button v-if="detail.status == 2" round mr-15px type="warning" @click="handleCommit">
        流程完成
      </n-button>
      <n-button round mr-15px type="primary" @click="downloadZip">文件打包</n-button>
      <n-button round mr-15px color="#8a2be2" @click="backList">返回列表</n-button>
    </div>

    <CrudModal
      v-model:visible="modalVisible"
      title="流程回执"
      width="400px"
      :show-footer="true"
      @on-save="handleSave"
      @on-cancel="handleCancel"
    >
      <n-form
        ref="formRef"
        :model="acquireDetail"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
        size="small"
      >
        <n-form-item label="取件方式">
          <n-select
            v-model:value="acquireDetail.acquireType"
            round
            disabled
            :options="acquireTypeFilter"
          ></n-select>
        </n-form-item>
        <n-form-item v-if="acquireDetail.acquireType === 0" label="邮寄地址">
          <n-input v-model:value="acquireDetail.address" round readonly />
        </n-form-item>
        <n-form-item v-if="acquireDetail.acquireType === 0" label="快递单号">
          <n-input v-model:value="acquireDetail.expressCode" placeholder="请填写快递单号" round />
        </n-form-item>
        <n-form-item v-if="acquireDetail.acquireType === 1" label="代办员联系电话">
          <n-input v-model:value="acquireDetail.acquirePhone" round readonly />
        </n-form-item>
        <n-form-item v-if="acquireDetail.acquireType === 1" label="代办员联系地址">
          <n-input v-model:value="acquireDetail.acquireAddress" type="textarea" round readonly />
        </n-form-item>
      </n-form>
    </CrudModal>
  </CommonPage>
</template>

<script setup>
import {
  People16Filled,
  BookNumber16Filled,
  AccessTime20Filled,
  HomePerson24Filled,
  Status24Filled,
  TextDescription20Filled,
  ProductionCheckmark20Filled,
} from '@vicons/fluent'
import { status, acquireType } from '@/utils/auth/dict'
import api from '@/views/task-list/api'
import CrudModal from '@/components/table/CrudModal.vue'
import { NButton } from 'naive-ui'
import qs from 'qs'
import { downloadFile } from '@/utils'

const route = useRoute()
const router = useRouter()
const statusFilter = status
const acquireTypeFilter = acquireType
const modalLoading = ref(false)
const modalVisible = ref(false)
const detail = ref({})
const material = ref([])
const backMaterials = ref({
  materialIds: [],
  applyId: '',
})
const acquireDetail = ref({})

async function getDetail(id) {
  try {
    modalLoading.value = true
    const res = await api.getDetail(id)
    if (res && res.code == 200) {
      detail.value = res.data
      acquireDetail.value = {
        acquireType: res.data.acquireType,
        acquirePhone: res.data.acquirePhone,
        acquireAddress: res.data.acquireAddress,
        address: res.data.address,
      }
    }
  } catch (err) {
    new Error(err)
  } finally {
    modalLoading.value = false
  }
}

function backList() {
  router.push(`/task-list/index`)
}

async function downloadZip() {
  try {
    const res = await api.downloadZip(route.params.id)
    if (res && res.code == 200) {
      downloadFile(res.data)
    }
  } catch (e) {
    new Error(e)
  }
}

function handleCancel() {
  modalVisible.value = false
}

async function handleSave() {
  try {
    const param = qs.stringify({
      applyId: route.params.id,
      expressCode: acquireDetail.value.acquireType == 0 ? acquireDetail.value.expressCode : null,
    })
    const res = await api.complete(param)
    if (res && res.code == 200) {
      $message.success(res.message)
      modalVisible.value = false
      getDetail(route.params.id)
    }
  } catch (e) {
    new Error(e)
  }
}
function handleCommit() {
  console.log(acquireDetail.value)
  modalVisible.value = true
}

async function backMaterial() {
  backMaterials.value.materialIds = material.value
  backMaterials.value.applyId = route.params?.id
  try {
    modalLoading.value = true
    const res = await api.returnMaterial(backMaterials.value)
    if (res && res.code === 200) {
      $message.success(res.message)
    }
  } catch (e) {
    new Error(e)
  } finally {
    modalLoading.value = false
  }
}

function checkMaterials(value) {
  material.value = value
}

onMounted(() => {
  if (route.params?.id) {
    getDetail(route.params?.id)
  }
})
</script>

<style scoped lang="scss">
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
  //font-weight: bold;
  &::before {
    content: '';
    display: inline-block;
    background-color: var(--primary-color);
    width: 4px;
    height: 18px;
    position: relative;
    left: -5px;
    border: 1px solid;
    border-radius: 10px;
    top: 50%;
    transform: translate(0, 11%);
  }
}
:deep(.n-descriptions) {
  padding: 20px 25px;
  box-shadow: 5px 6px 2px 1px rgba(207, 144, 144, 0.2), 0 2px 4px rgba(0, 0, 0, 0.2);
  .n-descriptions-table-content {
    line-height: 40px !important;
  }
}

.has-bottom-line {
  :deep(.n-descriptions-table-content__content) {
    border-bottom: 1px solid var(--primary-color);
  }
}
.b-1 {
  border-color: var(--primary-color);
}
</style>
