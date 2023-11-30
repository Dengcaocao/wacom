<template>
  <Teleport to="body">
    <div v-show="visible" class="modal">
      <Transition name="slide-fade">
        <div class="modal-content" v-show="visible">
          <h3 class="title">
            清空画布
            <i class="iconfont icon-colse close" @click="visible = false"></i>
          </h3>
          <p class="my-2.5 px-3">这将清空整个画布。是否继续?</p>
          <div class="footer">
            <button @click="visible = false">取消</button>
            <button @click="emit('notify')">确定</button>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineExpose } from 'vue'

const emit = defineEmits(['notify'])
const visible = ref(false)
defineExpose({
  visible
})
</script>

<style scoped>
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    @apply transition-all ease-out;
  }

  .slide-fade-enter-from,
  .slide-fade-leave-to {
    transform: translateY(-100px);
  }
  .modal {
    background-color: rgba(0, 0, 0, 0.6);
    @apply absolute inset-x-0 inset-y-0 m-auto z-20
           flex items-center justify-center
           w-full h-full;
  }
  .modal-content {
    @apply w-5/12 p-2.5 rounded bg-white opacity-100;
  }
  .title {
    @apply relative mb-2.5 text-center text-lg font-medium;
  }
  .title .close {
    @apply absolute right-0 text-lg text-slate-600 hover:text-slate-800 cursor-pointer;
  }
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
