<template>
  <main class="config-container md:config-container-max-h">
    <div class="item" v-if="currDrawType !== 'image'">
      <h3 class="title mt-0">描边</h3>
      <input-color v-model="styleConfig.color" />
    </div>
    <div class="item" v-if="['rect', 'diamond', 'arc'].includes(currDrawType)">
      <h3 class="title">背景</h3>
      <input-color v-model="styleConfig.fillColor" />
    </div>
    <template v-for="item in configList" :key="item.model">
      <div class="item" v-if="!item.display || item.display.includes(currDrawType)">
        <h3 class="title">{{item.title}}</h3>
        <div class="flex">
          <label
            v-for="(radioItem, index) in item.radioGroup"
            :key="index"
            :for="item.model + index"
            :title="radioItem.title"
            class="label"
            :class="styleConfig[item.model] === radioItem.type && 'active'">
            <input
              v-model="styleConfig[item.model]"
              type="radio"
              :value="radioItem.type"
              :name="item.model"
              :id="item.model + index"
              class="hidden">
            <div class="iconfont" :class="radioItem.classes"></div>
          </label>
        </div>
      </div>
    </template>
    <div class="item">
      <h3 class="title">透明度</h3>
      <input v-model="styleConfig.alpha" step="0.1" type="range" min="0" max="1" class="w-10/12">
    </div>
    <div class="item">
      <h3 class="title">操作</h3>
      <div class="flex">
        <div
          title="复制(ctrl+c)"
          @click="handleCopy"
          class="action iconfont icon-fuzhi_copy cursor-pointer hover:bg-theme-color-deep">
        </div>
        <div
          title="删除(backspace | delete)"
          @click="handleDel"
          class="action iconfont icon-weibiaoti544 cursor-pointer hover:bg-theme-color-deep">
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { reactive, toRaw, toRefs, onMounted, watch, ref, onUnmounted } from 'vue'
import { useConfigStore } from '@/stores/config'
import InputColor from '@/components/InputColor.vue'

const config = useConfigStore()
const { drawType, isCollapsed, styleConfig } = toRefs(config)

const currDrawType = ref<string>('')

const configList = reactive([
  {
    title: '填充',
    model: 'fillStyle',
    display: ['rect', 'diamond', 'arc'],
    radioGroup: [
      {
        title: '实心',
        type: 'simple',
        classes: 'icon-yuanjiaochangfangxing'
      },
      {
        title: '线条',
        type: 'line',
        classes: 'icon-legend-45'
      },
      {
        title: '网格',
        type: 'grid',
        classes: 'icon-xian1'
      }
    ]
  },
  {
    title: '描边宽度',
    model: 'width',
    display: ['rect', 'diamond', 'arc', 'mark', 'straightLine', 'paintingBrush'],
    radioGroup: [
      {
        title: '细',
        type: 1,
        classes: 'icon-xian3'
      },
      {
        title: '适中',
        type: 2,
        classes: 'icon-xian3 font-bold'
      },
      {
        title: '粗',
        type: 4,
        classes: 'icon-zhixiancu font-bold'
      }
    ]
  },
  {
    title: '描边样式',
    model: 'style',
    display: ['rect', 'diamond', 'arc', 'mark', 'straightLine'],
    radioGroup: [
      {
        title: '实线',
        type: 'solid',
        classes: 'icon-xian3'
      },
      // {
      //   title: '虚线',
      //   type: 'dashed',
      //   classes: 'icon-xuxian font-bold'
      // }
    ]
  },
  {
    title: '线条风格',
    model: 'type',
    display: ['rect', 'diamond', 'arc', 'mark', 'straightLine'],
    radioGroup: [
      {
        title: '朴素',
        type: 'simple',
        classes: 'icon-jurassic_curve'
      },
      {
        title: '手绘',
        type: 'stroke',
        classes: 'icon-duoquxianqiehuan'
      }
    ]
  },
  {
    title: '端点左',
    model: 'extremePoint_left',
    display: ['mark'],
    radioGroup: [
      {
        title: '无',
        type: 'none',
        classes: 'icon-toubuduandian'
      },
      {
        title: '箭头',
        type: 'arrow',
        classes: 'icon-jiantou-copy-copy'
      },
      {
        title: '线段',
        type: 'line',
        classes: 'icon-icon_07'
      }
    ]
  },
  {
    title: '端点右',
    model: 'extremePoint_right',
    display: ['mark'],
    radioGroup: [
      {
        title: '无',
        type: 'none',
        classes: 'icon-toubuduandian'
      },
      {
        title: '箭头',
        type: 'arrow',
        classes: 'icon-jiantou-copy'
      },
      {
        title: '线段',
        type: 'line',
        classes: 'icon-icon_-1'
      }
    ]
  },
  {
    title: '边角',
    model: 'horn',
    display: ['rect'],
    radioGroup: [
      {
        title: '直角',
        type: 'right',
        classes: 'icon-zhijiao'
      },
      // {
      //   title: '圆角',
      //   type: 'round',
      //   classes: 'icon-yuanjiao'
      // }
    ]
  }
])

const handleCopy = () => {
  const pixiApp = toRaw(config.pixiApp)
  pixiApp.copy()
}

const handleDel = () => {
  const pixiApp = toRaw(config.pixiApp)
  pixiApp.clear(true)
}

const handleCustomEvent = (e: CustomEventInit) => {
  const { drawType, styleConfig: currStyleConfig } = e.detail
  if (window.innerWidth > 750) isCollapsed.value = false
  currDrawType.value = drawType
  Object.assign(styleConfig.value, currStyleConfig)
}

watch(drawType, type => currDrawType.value = type)

onMounted(() => {
  document.addEventListener('getElmStyleConfig', handleCustomEvent)
})

onUnmounted(() => {
  document.removeEventListener('getElmStyleConfig', handleCustomEvent)
})
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
@layer components {
  .config-container {
    @apply w-full max-h-96 overflow-y-auto p-2;
  }
  .config-container.config-container-max-h {
    max-height: calc(100vh - 100px - 32px);
  }
  .title {
    @apply text-xs font-bold rounded my-1.5;
  }
  .label {
    @apply block bg-theme-color rounded ml-1.5 first:ml-0 px-2 cursor-pointer text-neutral-600 hover:bg-theme-color-deep;
  }
  .label.active {
    @apply bg-theme-color-deep;
  }
  .iconfont {
    @apply text-2xl leading-none;
  }
  .action {
    @apply text-base leading-none md:text-xl md:leading-none max-w-min bg-theme-color rounded ml-1.5 first:ml-0 p-2;
  }
}
</style>
