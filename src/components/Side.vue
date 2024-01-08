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
    <section class="config-container middle" :class="[!isCollapsed && 'active']">
      <config />
    </section>
    <section class="bottom">
      <button class="action" @click="updateScale('sub')">
        <i class="iconfont icon-jian"></i>
      </button>
      <div class="scale">{{ scale }}</div>
      <button class="action" @click="updateScale('add')">
        <i class="iconfont icon-jia"></i>
      </button>
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
const { pixiApp, isCollapsed, bgColor } = toRefs(config)

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

const scale = ref<string>()
watch(() => pixiApp.value.scale, newVal => {
  const percenter = newVal * 100
  scale.value = `${percenter.toFixed(0)}%`
}, { deep: true, immediate: true })

const updateScale = (type: 'add'|'sub') => pixiApp.value.updateCanvasScale(type)
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
         bg-white rounded-lg md:rounded md:my-4 md:right-80 md:bottom-auto;
  }
  .middle.active {
    @apply bottom-16 md:bottom-auto md:right-0;
  }
  .item {
    @apply p-2 rounded text-base leading-none md:text-xl md:leading-none cursor-pointer bg-theme-color hover:bg-theme-color-deep
  }
  .bottom {
    @apply absolute w-full p-1 hidden
           md:flex justify-between items-center
           rounded-md bg-white shadow-design;
    top: calc(100vh - 12px);
    transform: translateY(-100%);
  }
  .bottom .scale {
    @apply flex-1 text-center;
  }
  .bottom .action {
    @apply flex p-1.5 rounded bg-theme-color hover:bg-theme-color-deep focus:outline-none focus:ring focus:ring-zinc-300;
  }
  .action .iconfont {
    @apply text-xl leading-none;
  }
}
</style>
