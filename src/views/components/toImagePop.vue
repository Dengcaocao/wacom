<template>
  <pop ref="popModal" title="保存图片" @status-change="handleStatusChange">
    <div class="container-img">
      <img :src="url" class="w-full h-full object-contain" />
    </div>
    <div class="footer">
      <button @click="handleSaveImage('image/png')">PNG</button>
      <button @click="handleSaveImage('image/jpeg')">JPEG</button>
    </div>
  </pop>
</template>

<script setup lang="ts">
import { ref, toRaw } from 'vue'
import Pop from '@/components/Pop.vue'
import { useConfigStore } from '@/stores/config'

const config = useConfigStore()

const popModal = ref()
const url = ref('')

const handleStatusChange = async (status: boolean) => {
  if (status) {
    const pixiApp = toRaw(config.pixiApp)
    url.value = await pixiApp.canvas2Base64()
  }
}

const handleSaveImage = async (type: string) => {
  const pixiApp = toRaw(config.pixiApp)
  const src = await pixiApp.canvas2Base64(type)
  const tag_a = document.createElement('a')
  const name = Math.random().toString(16).slice(-6)
  tag_a.setAttribute('href', src)
  tag_a.setAttribute('download', name)
  tag_a.click()
  URL.revokeObjectURL(src)
  popModal.value.visible = false
}

defineExpose({
  popModal
})
</script>

<style scoped>
  .container-img {
    background-image: linear-gradient(white 50%, transparent 50%),
                      linear-gradient(to right, white 50%, transparent 50% );
    background-size: 4px 4px; 
    background-color: #e6e6e6;
    @apply flex justify-center items-center h-48 p-4;
  }
  .footer {
    @apply text-center;
  }
  .footer button {
    @apply w-10 h-10 p-2 m-2 box-content rounded-xl text-white shadow-lg;
  }
  .footer button:nth-child(1) {
    @apply bg-blue-600 hover:bg-blue-700;
  }
  .footer button:nth-child(2) {
    @apply bg-red-600 hover:bg-red-700;
  }
</style>
