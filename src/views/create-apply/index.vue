<template>
  <CommonPage show-footer title="事件列表">
    <!--    <n-card  size="small"  hoverable  :key="idx" b-rd-8  v-if="!isEmpty" v-for="(dept, idx) in departmentList">-->
    <!--      <template #header>-->
    <!--        <div font-semibold b-b-1 border-b-blueGray>{{ dept.name }}</div>-->
    <!--      </template>-->
    <!--      <template #header-extra>-->
    <!--        <div class="circle min-w-20 h-20 rounded-4rem text-3 text-center color-[#ffffff] br-20">{{ dept.itemModelList.length }}</div>-->
    <!--      </template>-->
    <!--      <n-scrollbar style="max-height: 150px">-->
    <!--        <n-list hoverable clickable>-->
    <!--          <n-list-item v-if="dept.itemModelList.length > 0"  v-for="(item, index) in dept.itemModelList" >{{ item.name }}</n-list-item>-->
    <!--        </n-list>-->
    <!--      </n-scrollbar>-->
    <!--    </n-card>-->
    <div
      v-if="!isEmpty"
      style="
        width: 100%;
        display: grid;
        gap: 16px;
        grid-template-columns: minmax(0px, 1fr) minmax(0px, 4fr);
      "
    >
      <n-anchor :show-rail="true" :show-background="true" affix :bound="120" ignore-gap>
        <n-anchor-link
          v-for="(dept, idx) in departmentList"
          :title="dept.name"
          :key="idx"
          :href="`#${dept.name}`"
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
            >
              {{ item.name }}
            </n-list-item>
            <n-list-item
              v-if="dept.itemModelList.length === 0"
            >
              暂无数据
            </n-list-item>
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
import { AppsSharp } from '@vicons/ionicons5'
import api from './api'
import CommonPage from '@/components/page/CommonPage.vue'
defineOptions({ name: 'CreateApply' })

const route = useRoute()
const router = useRouter()
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

// watch(route, (n, o) => {
//   router.go(0)
// })

onMounted(() => {
  getDepartmentList()
})
</script>

<style lang="scss" scoped>
:deep(.n-card) {
  .n-card__content {
    //display: grid;
    //gap: 16px;
    //grid-template-columns: minmax(0px, 1fr) minmax(0px, 1fr);
    //align-items: flex-start;
  }
}
.circle {
  background-color: var(--primary-color);
}
</style>
