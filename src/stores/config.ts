import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

export type IDrawType = 'select' | 'rect' | 'diamond' | 'arc' | 'arrow' | 'line' | 'pen' | 'text' | 'pic'

export interface IContext {
  width: number,
  strokeColor: string,
  fillColor: string,
  alpha: 1,
  fontSize: 14
}

export const useConfigStore = defineStore('config', () => {
  const drawType = ref<IDrawType>('select')
  const updateDrawType = (type: IDrawType) => drawType.value = type

  const context = reactive<IContext>({
    width: 1,
    strokeColor: 'red',
    fillColor: 'transparent',
    alpha: 1,
    fontSize: 14
  })

  return { drawType, updateDrawType, context }
})
