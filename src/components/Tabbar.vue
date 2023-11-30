<template>
  <header class="header">
    <span
      v-for="icon in icons"
      :key="icon.name"
      class="item iconfont"
      :class="[icon.name, icon.action === configStore.drawType && 'active']"
      @click="handleUpdateDrawType(icon.action as IDrawType)">
    </span>
  </header>
</template>

<script setup lang="ts">
import { reactive, toRaw, watch } from 'vue'
import type { IDrawType } from '@/stores/types'
import { useConfigStore } from '@/stores/config'

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
    action: 'mark'
  },
  {
    name: 'icon-xian',
    action: 'straightLine'
  },
  {
    name: 'icon-Icon_huabi',
    action: 'paintingBrush'
  },
  {
    name: 'icon-ziti',
    action: 'text'
  },
  {
    name: 'icon-tupian',
    action: 'image'
  }
])

watch(() => configStore.drawType, (value) => {
  document.body.style.cursor = value === 'select' ? 'default' : 'crosshair'
})

const handleUpdateDrawType = (type: IDrawType) => {
  configStore.drawType = type
  if (type === 'image') {
    const inputElm = document.createElement('input')
    inputElm.setAttribute('type', 'file')
    inputElm.setAttribute('multiple', 'false')
    inputElm.onchange = () => {
      const file = (inputElm.files as FileList)[0]
      const url = URL.createObjectURL(file)
      const pixiApp = toRaw(configStore.pixiApp)
      pixiApp.drawImage(url)
      configStore.drawType = 'select'
    }
    inputElm.click()
  }
}
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
@layer components {
  .header {
    transform: translateX(-50%);
    @apply absolute top-1.5 left-1/2 z-10
           grid grid-flow-col auto-cols-min gap-1
           p-1 rounded shadow-design bg-white;
  }
  .item {
    @apply text-base leading-none md:text-xl md:leading-none p-2 rounded cursor-pointer bg-theme-color hover:bg-theme-color-deep
  }
  .active {
    background-color: theme('colors.theme-color-deep');
  }
}
</style>
