import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

type drawType = 'select' | 'rect' | 'diamond' | 'arc' | 'arrow' | 'line' | 'pen' | 'font' | 'pic'

interface IContext {
  width: number,
  strokeColor: string,
  fillColor: string,
  alpha: 1
}

export const useConfigStore = defineStore('config', () => {
  const drawType = ref<drawType>('select')
  const updateDrawType = (type: drawType) => drawType.value = type

  const context = reactive({
    width: 1,
    strokeColor: 'red',
    fillColor: 'transparent',
    alpha: 1
  })

  return { drawType, updateDrawType, context }
})
