<template>
  <div class="grid grid-flow-col auto-cols-min gap-1">
    <input type="color" v-model="colorValue" class="w-8 h-8" :class="inputValue === 'transparent' && inputValue" />
    <div class="input-container">
      <div class="shrink-0 w-8 h-full leading-8 text-center bg-theme-color-deep">#</div>
      <input v-model="inputValue" type="text" class="w-full outline-0 flex-1 indent-2">
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string
}>()
const emit = defineEmits(['update:modelValue'])
const colorValue = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emit('update:modelValue', value)
  }
})
const inputValue = computed({
  get () {
    return /^#/.test(props.modelValue)
      ? props.modelValue.slice(1)
      : props.modelValue
  },
  set (value) {
    if (value.length < 6) return
    emit('update:modelValue', `#${value}`)
  }
})
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
@layer components {
  .input-container {
    border-width: 1px;
    border-color: theme('colors.theme-color-deep');
    @apply flex w-40 h-8 rounded overflow-hidden
  }
}
.transparent {
  background-image: url('@/assets/bg-transparent.png');
  background-size: cover;
}
.transparent::-webkit-color-swatch {
  width: 0;
}
</style>