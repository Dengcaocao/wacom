<template>
  <aside class="mobile md:pc" :class="[!isCollapsed && 'active']">
    <section class="top">
      <div title="清空" class="item iconfont icon-weibiaoti544" @click="clearpop.popModal.visible = true"></div>
      <div title="保存图片" class="item iconfont icon-export-img" @click="toImagePop.popModal.visible = true"></div>
      <div class="item iconfont icon-dongtaitiaosepan md:hidden" @click="isCollapsed = !isCollapsed"></div>
      <div class="item bg-transparent hover:bg-transparent text-base p-0">
        <input-color v-model="bgColor" />
      </div>
    </section>
    <section class="middle" :class="[!isCollapsed && 'active']">
      <config />
    </section>
    <clear-pop ref="clearpop" />
    <to-image ref="toImagePop" />
  </aside>
</template>

<script setup lang="ts">
import { ref, toRaw, toRefs, watch } from 'vue'
import { useConfigStore } from '@/stores/config'
import InputColor from '@/components/InputColor.vue'
import Config from './Config.vue'
import ClearPop from '@/views/components/ClearPop.vue'
import ToImage from '@/views/components/toImagePop.vue'

const config = useConfigStore()
const { isCollapsed, bgColor } = toRefs(config)

const clearpop = ref()
const toImagePop = ref()

watch(bgColor, color => {
  const app = toRaw(config.pixiApp)
  app.graphicsConfig = {
    ...app.graphicsConfig,
    bgColor: color
  }
  app.updateCanvasBg()
})
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
@layer components {
  .mobile {
    @apply absolute right-1/2 translate-x-1/2 bottom-5 overflow-hidden
           w-11/12 shadow-design rounded-md bg-white;
  }
  .mobile.active {
    @apply overflow-visible shadow-none;
  }
  .pc {
    @apply overflow-visible top-1.5 left-1.5 translate-x-0
           w-min h-min rounded-none p-0;
  }
  .top {
    @apply relative z-10
           grid items-center grid-flow-col auto-cols-min gap-1 p-2
           w-full bg-white rounded-lg
           md:z-0 md:p-1 md:rounded;
  }
  .active .top {
    @apply shadow-design;
  }
  .middle {
    @apply absolute bottom-0 z-0 w-full transition-all shadow-design
         bg-white rounded-lg md:rounded md:mt-4 md:right-80 md:bottom-auto;
  }
  .middle.active {
    @apply bottom-16 md:bottom-auto md:right-0;
  }
  .item {
    @apply p-2 rounded text-base leading-none md:text-xl md:leading-none cursor-pointer bg-theme-color hover:bg-theme-color-deep
  }
}
</style>
