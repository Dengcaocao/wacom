import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

export type IDrawType = 'select' | 'rect' | 'diamond' | 'arc' | 'arrow' | 'line' | 'pen' | 'text' | 'pic'

export interface IContext {
  bgColor: string
  strokeColor: string
  fillColor: string
  fillStyle: 'fill' | 'texture'
  strokeWidth: 1 | 2 | 4
  line: 'solid' | 'dashed'
  lineStyle: 'simple' | 'texture'
  horn: 'right' | 'round'
  alpha: number
  fontSize: number,
  [key: string]: any
}

export const useConfigStore = defineStore('config', () => {

  const scale = ref(1)
  
  const drawType = ref<IDrawType>('select')
  const updateDrawType = (type: IDrawType) => drawType.value = type

  const context = reactive<IContext>({
    bgColor: '#ffffff',
    strokeColor: '#ff0000',
    fillColor: 'transparent',
    fillStyle: 'fill',
    strokeWidth: 1,
    line: 'solid',
    lineStyle: 'simple',
    horn: 'right',
    alpha: 1,
    fontSize: 14
  })

  const upDateContext = (options: object) => {
    Object.assign(context, options)
  }

  return { drawType, updateDrawType, context, upDateContext }
})
