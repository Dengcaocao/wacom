import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  const drawType = ref('select')
  const updateDrawType = (type: string) => drawType.value = type

  return { drawType, updateDrawType }
})
