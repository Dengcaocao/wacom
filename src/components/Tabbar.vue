<template>
  <header class="header">
    <span
      v-for="icon in icons"
      :key="icon.name"
      class="item iconfont"
      :class="[icon.name, icon.action === configStore.drawType && 'active']"
      :title="icon.title"
      @click="handleUpdateDrawType(icon.action as IDrawType)">
    </span>
    <div class="tips">{{tips}}</div>
  </header>
</template>

<script setup lang="ts">
import { reactive, ref, toRaw, watch } from 'vue'
import type { IDrawType } from '@/stores/types'
import { useConfigStore } from '@/stores/config'

const info: any = {
  select: '滚动或空格+鼠标左键移动画布',
}

const configStore = useConfigStore()

const tips = ref(info.select)
const icons = reactive([
  {
    title: '选择',
    name: 'icon-zhizhen',
    action: 'select'
  },
  {
    title: '矩形',
    name: 'icon-dantupailie',
    action: 'rect'
  },
  {
    title: '菱形',
    name: 'icon-lingxing',
    action: 'diamond'
  },
  {
    title: '圆',
    name: 'icon-luyin',
    action: 'arc'
  },
  {
    title: '箭头',
    name: 'icon-xiangshangjiantoucuxiao',
    action: 'mark'
  },
  {
    title: '线段',
    name: 'icon-xian',
    action: 'straightLine'
  },
  {
    title: '画笔',
    name: 'icon-Icon_huabi',
    action: 'paintingBrush'
  },
  {
    title: '文本',
    name: 'icon-ziti',
    action: 'text'
  },
  {
    title: '图片',
    name: 'icon-tupian',
    action: 'image'
  }
])

watch(() => configStore.drawType, type => {
  if (type !== 'select') {
    configStore.isCollapsed = false
    configStore.pixiApp.removeSelected()
  }
  tips.value = info[type]
  configStore.pixiApp.graphicsConfig = {
    ...configStore.pixiApp.graphicsConfig,
    drawType: type
  }
  document.body.style.cursor = type === 'select' ? 'default' : 'crosshair'
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
  .tips {
    @apply absolute bottom-0 translate-y-full
           w-full text-xs leading-8 text-center text-slate-600;
  }
}
</style>
