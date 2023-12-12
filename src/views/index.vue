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
import { onMounted, ref, toRaw, toRefs, watch } from 'vue'
import { useConfigStore } from '@/stores/config'
import Tabbar from '@/components/Tabbar.vue'
import Side from '@/components/Side.vue'
import Application from '@/actions/application'

const configStore = useConfigStore()

const container = ref<HTMLElement>()

watch(configStore.styleConfig, styleConfig => {
  const app = toRaw(configStore.pixiApp)
  app.graphicsConfig = {
    drawType: configStore.drawType,
    styleConfig
  }
  if (app.container) {
    app.container.customInfo = {
      ...app.container.customInfo,
      styleConfig
    }
    app.createElement()
  }
})
 
onMounted(() => {
  const app = new Application({
    width: window.innerWidth,
    height: window.innerHeight,
    graphicsConfig: {
      drawType: configStore.drawType,
      styleConfig: configStore.styleConfig
    },
    dom: container.value as HTMLElement
  })
  configStore.pixiApp = app
})
</script>
