import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import type { IDrawType, IElementStyle } from './types'

export const useConfigStore = defineStore('config', () => {
  // 绘制实例
  const pixiApp = ref()
  // 缩放
  const scale = ref(2)
  // 是否折叠
  const isCollapsed = ref(true)
  // 绘制类型
  const drawType = ref<IDrawType>('select')
  // 画布背景
  const bgColor = ref('#ffffff')
  // 元素样式
  const styleConfig = reactive<IElementStyle>({
    width: 1,
    color: '#000000',
    style: 'solid',
    alpha: 1,
    type: 'stroke',
    fillColor: 'transparent',
    fillStyle: 'simple',
    extremePoint_left: 'none',
    extremePoint_right: 'arrow',
    horn: 'right'
  })

  return { pixiApp, scale, isCollapsed, drawType, bgColor, styleConfig }
})
