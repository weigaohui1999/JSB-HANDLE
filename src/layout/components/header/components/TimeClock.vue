<template>
  <div class="timeBox">
    <div class="timeItem">
      <div class="time">{{ time.time }}</div>
      <div class="second">{{ time.second }}</div>
    </div>
    <div class="dateItem">
      <div class="week">{{ time.week }}</div>
      <div class="date">{{ time.date }}</div>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
const timer = ref(null)
const time = ref({})
const getDate = () => {
  time.value = parseTime(new Date())
}
// 根据传入的时间，处理成需要的对象函数
const parseTime = (time) => {
  let resObj = {}
  let week = ['日', '一', '二', '三', '四', '五', '六']
  resObj.date = dayjs(time).format('YYYY年MM月DD日')
  resObj.week = `星期${week[dayjs(time).day()]}`
  resObj.time = dayjs(time).format('HH:mm')
  resObj.second = dayjs(time).format('ss')
  return resObj
}

onMounted(() => {
  timer.value = setInterval(() => {
    getDate()
  }, 100)
})

onBeforeUnmount(() => {
  clearInterval(timer.value)
  timer.value = null
})
</script>
<style lang="scss" scoped>
.timeBox {
  width: 100%;
  border-radius: 30px;
  margin: 30px auto;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  justify-content: center;
  cursor: default;
  .clockBox {
    width: 120px;
  }
  .timeItem {
    display: flex;
    color: #333639;
    width: 220px;
    justify-content: center;
    .time {
      font: 38px/76px 'pf';
    }
    .second {
      font: 20px/40px 'pf';
      margin: 12px 0 0 8px;
    }
  }
  .dateItem {
    width: 200px;
    color: #333639;
    padding-top: 15px;
    padding-left: 40px;
    display: flex;
    flex-direction: column;
    align-content: center;
    align-items: center;
    .week {
      font: 22px/22px 'pf';
    }
    .date {
      margin-top: 10px;
      font: 18px/18px 'pf';
    }
  }
}
</style>
