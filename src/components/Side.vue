<template>
  <aside class="absolute mobile md:pc">
    <section class="top md:shadow-design md:rounded">
      <div class="item iconfont icon-weibiaoti544"></div>
      <div class="item iconfont icon-export-img"></div>
      <div class="item bg-transparent hover:bg-transparent text-base p-0">
        <input-color v-model="context.bgColor" />
      </div>
    </section>
    <section class="middle w-full">
      <config />
    </section>
  </aside>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { useConfigStore } from '@/stores/config'
import InputColor from '@/components/InputColor.vue'
import Config from './Config.vue'

const { context } = toRefs(useConfigStore())
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
@layer components {
  .mobile {
    max-height: 70%;
    @apply w-full overflow-auto rounded-t-lg bottom-0 pt-1 bg-white
  }
  .pc {
    @apply w-min h-min overflow-visible top-1.5 left-1.5 rounded-none pt-0 bg-transparent
  }
  .top {
    @apply grid items-center grid-flow-col auto-cols-min gap-1 p-1 bg-white
  }
  .item {
    @apply p-2 rounded text-base leading-none md:text-xl md:leading-none cursor-pointer bg-theme-color hover:bg-theme-color-deep
  }
}
</style>
