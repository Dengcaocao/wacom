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
import { useDraw } from '@/hooks/draw'
import Tabbar from '@/components/Tabbar.vue'
import Side from '@/components/Side.vue'

const { CreateSceen } = useDraw()

const container = ref<HTMLElement>()

onMounted(() => {
  new CreateSceen(container, window.innerWidth * 2, window.innerHeight * 2)
})
</script>
