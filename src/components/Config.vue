<template>
  <main class="w-60 bg-white mt-4 p-2 shadow-design rounded">
    <div class="item">
      <h3 class="title mt-0">描边</h3>
      <input-color v-model="context.strokeColor" />
    </div>
    <div class="item">
      <h3 class="title">背景</h3>
      <input-color v-model="context.fillColor" />
    </div>
    <div class="item" v-for="item in configList" :key="item.model">
      <h3 class="title">{{item.title}}</h3>
      <div class="flex">
        <label
          v-for="(radioItem, index) in item.radioGroup"
          :key="index"
          :for="item.model + index"
          :title="radioItem.title"
          class="label"
          :class="context[item.model] === radioItem.type && 'active'">
          <input
            v-model="context[item.model]"
            type="radio"
            :value="radioItem.type"
            :name="item.model"
            :id="item.model + index"
            class="hidden">
          <div class="iconfont" :class="radioItem.classes"></div>
        </label>
      </div>
    </div>
    <div class="item">
      <h3 class="title">透明度</h3>
      <input v-model="context.alpha" type="range" min="0" max="1" class="w-full">
    </div>
    <div class="item">
      <h3 class="title">操作</h3>
      <div class="flex">
        <div class="action iconfont icon-fuzhi_copy"></div>
        <div class="action iconfont icon-weibiaoti544"></div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { reactive, toRefs } from 'vue'
import { useConfigStore } from '@/stores/config'
import InputColor from '@/components/InputColor.vue'

const { context } = toRefs(useConfigStore())

const configList = reactive([
  {
    title: '填充',
    model: 'fillStyle',
    radioGroup: [
      {
        title: '实心',
        type: 'fill',
        classes: 'icon-yuanjiaochangfangxing'
      }
    ]
  },
  {
    title: '描边宽度',
    model: 'strokeWidth',
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
    model: 'line',
    radioGroup: [
      {
        title: '实线',
        type: 'solid',
        classes: 'icon-xian3'
      },
      {
        title: '虚线',
        type: 'dashed',
        classes: 'icon-xuxian font-bold'
      }
    ]
  },
  {
    title: '线条风格',
    model: 'lineStyle',
    radioGroup: [
      {
        title: '朴素',
        type: 'simple',
        classes: 'icon-jurassic_curve'
      }
    ]
  },
  {
    title: '边角',
    model: 'horn',
    radioGroup: [
      {
        title: '直角',
        type: 'right',
        classes: 'icon-zhijiao'
      },
      {
        title: '圆角',
        type: 'round',
        classes: 'icon-yuanjiao'
      }
    ]
  }
])
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
@layer components {
  .title {
    @apply text-xs font-bold rounded my-1.5
  }
  .label {
    @apply block bg-theme-color rounded ml-1.5 first:ml-0 px-2 cursor-pointer text-neutral-600 hover:bg-theme-color-deep
  }
  .label.active {
    @apply bg-theme-color-deep
  }
  .iconfont {
    @apply text-2xl leading-none
  }
  .action {
    @apply text-xl leading-5 max-w-min bg-theme-color rounded ml-1.5 first:ml-0 p-2
  }
}
</style>
