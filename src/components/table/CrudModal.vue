<template>
  <n-modal
    v-model:show="show"
    :style="{ width }"
    preset="card"
    :title="title"
    size="huge"
    :bordered="false"
    :mask-closable="false"
    class="my-modal"
  >
    <template #header-extra>
      <slot name="header-extra" />
    </template>
    <slot />
    <template v-if="showFooter" #footer>
      <footer flex justify-end>
        <slot name="footer">
          <n-button round @click="emit('onCancel')">取消</n-button>
          <n-button round :loading="loading" ml-20 type="primary" @click="emit('onSave')">
            保存
          </n-button>
        </slot>
      </footer>
    </template>
    <template v-else #footer>
      <slot name="footer" />
    </template>
  </n-modal>
</template>

<script setup>
const props = defineProps({
  width: {
    type: String,
    default: '600px',
  },
  title: {
    type: String,
    default: '',
  },
  showFooter: {
    type: Boolean,
    default: true,
  },
  visible: {
    type: Boolean,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:visible', 'onSave', 'onCancel'])
const show = computed({
  get() {
    return props.visible
  },
  set(v) {
    emit('update:visible', v)
  },
})
</script>
<style lang="scss">
.my-modal {
  border-radius: 10px !important;
  .n-card-header {
    text-align: center;
  }
  .n-card__content {
    padding: 0 var(--n-padding-left) var(--n-padding-bottom) var(--n-padding-left);
  }
  .n-card__footer {
    margin: 0 auto;
  }
}
.n-base-close {
  border-radius: 22px;
  background-color: crimson;
  width: 22px !important;
  height: 22px !important;
  color: aliceblue;
}
.n-button .n-button__icon {
  left: 3px;
}
</style>
