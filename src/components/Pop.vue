<template>
  <Teleport to="body">
    <div v-show="visible" class="modal">
      <Transition name="slide-fade">
        <div class="modal-content" v-show="visible">
          <h3 class="title">
            {{ props.title }}
            <i class="iconfont icon-colse close" @click="visible = false"></i>
          </h3>
          <slot></slot>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  title: string
}>()

const emit = defineEmits(['statusChange'])

const visible = ref(false)
watch(visible, (status: boolean) => {
  emit('statusChange', status)
})

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
    min-width: 20rem;
    @apply w-5/12 p-2.5 rounded bg-white opacity-100;
  }
  .title {
    @apply relative mb-2.5 text-center text-lg font-medium;
  }
  .title .close {
    @apply absolute right-0 text-lg text-slate-600 hover:text-slate-800 cursor-pointer;
  }
</style>
