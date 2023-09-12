<template>
  <header class="header">
    <span
      v-for="icon in icons"
      :key="icon.name"
      class="item iconfont"
      :class="icon.name"></span>
  </header>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const icons = reactive([
  {
    name: 'icon-zhizhen',
    action: ''
  },
  {
    name: 'icon-dantupailie',
    action: ''
  },
  {
    name: 'icon-lingxing',
    action: ''
  },
  {
    name: 'icon-luyin',
    action: ''
  },
  {
    name: 'icon-xiangshangjiantoucuxiao',
    action: ''
  },
  {
    name: 'icon-xian',
    action: ''
  },
  {
    name: 'icon-Icon_huabi',
    action: ''
  },
  {
    name: 'icon-ziti',
    action: ''
  },
  {
    name: 'icon-tupian',
    action: ''
  }
])
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
@layer components {
  .header {
    transform: translateX(-50%);
    @apply absolute top-1.5 left-1/2 grid grid-flow-col auto-cols-min gap-1 p-1 rounded shadow-design bg-white
  }
  .item {
    @apply text-xl leading-5 p-2 rounded cursor-pointer bg-theme-color hover:bg-theme-color-deep
  }
}
</style>
