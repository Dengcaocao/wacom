<template>
  <div class="input-container">
    <div class="prefix">#</div>
    <input v-model="value" type="text" class="w-full outline-0 flex-1 indent-2">
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string
}>()
const emit = defineEmits(['update:modelValue'])
const value = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emit('update:modelValue', value)
  }
})
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
@layer components {
  .input-container {
    width: 160px;
    border-width: 1px;
    border-color: theme('colors.theme-color-deep');
    @apply flex h-8 rounded overflow-hidden
  }
  .prefix {
    @apply shrink-0 w-8 h-full leading-8 text-center bg-theme-color-deep
  }
}
</style>