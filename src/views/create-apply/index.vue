<template>
  <CommonPage show-footer title="事项列表">
    <div
      v-if="!isEmpty"
      style="
        width: 100%;
        display: grid;
        gap: 16px;
        grid-template-columns: minmax(0px, 1fr) minmax(0px, 4fr);
      "
    >
      <n-anchor :show-rail="true" :show-background="true" :bound="100">
        <n-anchor-link
          v-for="(dept, idx) in departmentList"
          :title="dept.name"
          :key="idx"
          :href="`#${dept.name}`"
          @click="stopHandle($event)"
        />
      </n-anchor>
      <n-scrollbar style="max-height: 80vh">
        <n-card
          size="small"
          hoverable
          :key="idx"
          b-rd-8
          v-if="!isEmpty"
          v-for="(dept, idx) in departmentList"
          :id="dept.name"
          mb-10px
        >
          <template #header>
            <n-badge :value="dept.itemModelList.length" :max="9999">
              <div font-semibold b-b-1 border-b-blueGray>{{ dept.name }}</div>
            </n-badge>
          </template>
          <n-list hoverable clickable>
            <n-list-item
              v-if="dept.itemModelList.length > 0"
              v-for="(item, index) in dept.itemModelList"
              :key="index"
            >
              {{ index + 1 + '.' + item.name }}
              <template #suffix>
                <n-button-group>
                  <n-button ghost type="primary" @click="toDetail(item.id)">办事指南</n-button>
                  <n-button
                    type="primary"
                    @click="toApply(item.id, item.materialsList, item.departmentId)"
                  >
                    在线办理
                  </n-button>
                </n-button-group>
              </template>
            </n-list-item>
            <n-list-item v-if="dept.itemModelList.length === 0">暂无数据</n-list-item>
          </n-list>
        </n-card>
      </n-scrollbar>
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
import userApi from '@/views/user-center/api'
import CommonPage from '@/components/page/CommonPage.vue'
import { router } from '@/router'
import { lStorage } from '@/utils'
defineOptions({ name: 'CreateApply' })
const isEmpty = ref(false)
const departmentList = ref([])
async function getDepartmentList() {
  try {
    const res = await userApi.getDepartmentList()
    if (res && res.code === 200) {
      departmentList.value = res.data
    } else {
      isEmpty.value = true
    }
  } catch (e) {
    isEmpty.value = true
    new Error(e)
  }
}

function stopHandle(event) {
  event.preventDefault()

}

function toDetail(id) {
  router.push(`/create-apply/detail/${id}`)
}

function toApply(id, materialsList, deptId) {
  lStorage.set('materialsList', materialsList || [])
  router.push({
    path: `/create-apply/apply/${id}`,
    query: { deptId: deptId },
  })
}

onMounted(() => {
  getDepartmentList()
})
</script>

<style lang="scss" scoped>
:deep(.n-list-item__suffix) {
  width: 160px;
  flex-basis: auto !important;
}
.circle {
  background-color: var(--primary-color);
}
</style>
