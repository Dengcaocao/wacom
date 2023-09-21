<template>
  <header class="header">
    <span
      v-for="icon in icons"
      :key="icon.name"
      class="item iconfont"
      :class="[icon.name, icon.action === configStore.drawType && 'active']"
      @click="handleDrawType(icon.action as IDrawType)">
    </span>
  </header>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useConfigStore, type IDrawType } from '@/stores/config'

const configStore = useConfigStore()

const icons = reactive([
  {
    name: 'icon-zhizhen',
    action: 'select'
  },
  {
    name: 'icon-dantupailie',
    action: 'rect'
  },
  {
    name: 'icon-lingxing',
    action: 'diamond'
  },
  {
    name: 'icon-luyin',
    action: 'arc'
  },
  {
    name: 'icon-xiangshangjiantoucuxiao',
    action: 'arrow'
  },
  {
    name: 'icon-xian',
    action: 'line'
  },
  {
    name: 'icon-Icon_huabi',
    action: 'pen'
  },
  {
    name: 'icon-ziti',
    action: 'text'
  },
  {
    name: 'icon-tupian',
    action: 'pic'
  }
])

watch(() => configStore.drawType, (value) => {
  document.body.style.cursor = value === 'select' ? 'default' : 'crosshair'
})

const handleDrawType = (type: IDrawType) => {
  configStore.updateDrawType(type)
}
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
  .active {
    background-color: theme('colors.theme-color-deep');
  }
}
</style>
