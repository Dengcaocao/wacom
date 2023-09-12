<template>
  <section>
    <section>
      <Tabbar />
      <Side />
    </section>
    <main ref="container" class="container"></main>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as PIXI from 'pixi.js'
import Tabbar from '@/components/Tabbar.vue'
import Side from '@/components/Side.vue'
const container = ref<HTMLElement>()

const initCanvas = () => {
  const app = new PIXI.Application({
    width: window.innerWidth * 2,
    height: window.innerHeight * 2,
    backgroundColor: '#fff',
    backgroundAlpha: 0.5,
    antialias: true
  })

  if (app.view.style) {
    app.view.style.width = window.innerWidth + 'px'
    app.view.style.height = window.innerHeight + 'px'
  }
  // 设置画布比例
  app.stage.scale.set(2)
  // 设置容器位置
  app.stage.x = -app.screen.width / 2
  app.stage.y = -app.screen.height / 2

  // 网格绘制
  const mesh = new PIXI.Graphics()
  mesh.clear()
  mesh.lineStyle(1, 0x000000, 0.1)
  for (let i = 0; i < app.screen.width; i+=20) {
    mesh.moveTo(i, 0)
    mesh.lineTo(i, app.screen.height)
  }
  for (let i = 0; i < app.screen.height; i+=20) {
    mesh.moveTo(0, i)
    mesh.lineTo(app.screen.width, i)
  }
  app.stage.addChild(mesh)

  container.value?.appendChild(app.view as any)  
  
  // 添加滚动事件，超出边界值重置容器的位置
  document.addEventListener('wheel', e => {
    app.stage.x += e.deltaX * -1
    app.stage.y += e.deltaY * -1
    app.stage.children.forEach((item, index) => {
      if (index) {
        item.x += e.deltaX * -1
        item.y += e.deltaY * -1
      }
    })
    if (app.stage.x >=0 || app.stage.x <= -app.screen.width || app.stage.y >= 0 || app.stage.y <= -app.screen.height) {
      app.stage.x = -app.screen.width / 2
      app.stage.y = -app.screen.height / 2
    }
  })
}

onMounted(() => {
  initCanvas()
})
</script>

<style scoped lang="scss">
</style>
