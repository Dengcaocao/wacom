<template>
  <pop ref="popModal" title="清空画布">
    <p class="my-2.5 px-3">这将清空整个画布。是否继续?</p>
    <div class="footer">
      <button @click="popModal.visible = false">取消</button>
      <button @click="handleClear">确定</button>
    </div>
  </pop>
</template>

<script setup lang="ts">
import { ref, defineExpose, toRefs } from 'vue'
import Pop from '@/components/Pop.vue'
import { useConfigStore } from '@/stores/config'

const { pixiApp } = toRefs(useConfigStore())

const popModal = ref()

const handleClear = () => {
  pixiApp.value.clear()
  popModal.value.visible = false
}

defineExpose({
  popModal
})
</script>

<style scoped>
  .footer {
    @apply text-right;
  }
  .footer button {
    @apply m-2.5 px-2.5 py-1 rounded bg-theme-color hover:bg-theme-color-deep;
  }
  .footer button:nth-child(2) {
    @apply text-white bg-red-600 hover:bg-red-700;
  }
</style>
