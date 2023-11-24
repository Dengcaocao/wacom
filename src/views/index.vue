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
import { useConfigStore } from '@/stores/config'
import Tabbar from '@/components/Tabbar.vue'
import Side from '@/components/Side.vue'
import Application from '@/actions/application'

const configStore = useConfigStore()

const container = ref<HTMLElement>()
 
onMounted(() => {
  configStore.pixiApp = new Application({
    width: window.innerWidth,
    height: window.innerHeight,
    styleConfig: configStore.styleConfig,
    dom: container.value as HTMLElement
  })
})
</script>
