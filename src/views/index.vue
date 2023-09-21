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
import { onMounted, ref, watch } from 'vue'
import { useConfigStore } from '@/stores/config'
import { useDraw } from '@/hooks/draw'
import Tabbar from '@/components/Tabbar.vue'
import Side from '@/components/Side.vue'

const configStore = useConfigStore()

const { CreateSceen } = useDraw()

const container = ref<HTMLElement>()

watch(configStore.context, () => {
  configStore.drawInstance.setLineStyle(undefined, true)
})
 
onMounted(() => {
  configStore.drawInstance = new CreateSceen(container, window.innerWidth * 2, window.innerHeight * 2)
})
</script>
