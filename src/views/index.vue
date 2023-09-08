<template>
  <section>
    <section>
      <Tabbar />
      <Side />
    </section>
    <main ref="container"></main>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as PIXI from 'pixi.js'
import Tabbar from '@/components/Tabbar.vue'
import Side from '@/components/Side.vue'
const container = ref<HTMLElement>()

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerWidth,
  antialias: true,
  resizeTo: window
})

onMounted(() => {
  container.value?.appendChild(app.view as any)
})
</script>
