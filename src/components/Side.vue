<template>
  <aside class="absolute top-1.5 left-1.5">
    <section class="top">
      <div class="item iconfont icon-weibiaoti544"></div>
      <div class="item iconfont icon-export-img"></div>
      <div class="item bg-transparent hover:bg-transparent text-base p-0">
        <input-color v-model="context.bgColor" />
      </div>
    </section>
    <config />
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
  .top {
    @apply grid items-center grid-flow-col auto-cols-min gap-1 p-1 rounded shadow-design bg-white
  }
  .item {
    @apply p-2 rounded text-xl leading-5 cursor-pointer bg-theme-color hover:bg-theme-color-deep
  }
}
</style>
