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
import { onMounted, ref, toRaw, watch } from 'vue'
import { useConfigStore } from '@/stores/config'
import Tabbar from '@/components/Tabbar.vue'
import Side from '@/components/Side.vue'
import Application from '@/actions/application'

const configStore = useConfigStore()

const container = ref<HTMLElement>()

// 初始化画布实例
const canvasApp = new Application({
  width: window.innerWidth,
  height: window.innerHeight,
  graphicsConfig: {
    bgColor: configStore.bgColor,
    drawType: configStore.drawType,
    styleConfig: configStore.styleConfig
  }
})
configStore.pixiApp = canvasApp

watch(configStore.styleConfig, styleConfig => {
  const app = toRaw(configStore.pixiApp)
  app.graphicsConfig = {
    ...app.graphicsConfig,
    drawType: configStore.drawType,
    styleConfig: { ...styleConfig }
  }
  if (app.container) app.reRender({ ...styleConfig })
})
 
onMounted(() => container.value?.appendChild(canvasApp.app.view as HTMLCanvasElement))
</script>
