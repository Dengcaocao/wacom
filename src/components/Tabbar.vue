<template>
  <header>
    <span
      v-for="icon in icons"
      :key="icon.name"
      class="item iconfont"
      :class="icon.name"></span>
  </header>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const icons = reactive([
  {
    name: 'icon-zhizhen',
    action: ''
  },
  {
    name: 'icon-dantupailie',
    action: ''
  },
  {
    name: 'icon-lingxing',
    action: ''
  },
  {
    name: 'icon-luyin',
    action: ''
  },
  {
    name: 'icon-xiangshangjiantoucuxiao',
    action: ''
  },
  {
    name: 'icon-xian',
    action: ''
  },
  {
    name: 'icon-Icon_huabi',
    action: ''
  },
  {
    name: 'icon-ziti',
    action: ''
  },
  {
    name: 'icon-tupian',
    action: ''
  }
])
</script>

<style scoped lang="scss">
header {
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  display: grid;
  grid-template-rows: auto;
  grid-auto-flow: column;
  grid-auto-columns: min-content;
  gap: $sm-gap;
  padding: $sm-gap;
  border-radius: $sm-radius;
  background-color: #fff;
  box-shadow: $box-shadow;
  .item {
    padding: $md-gap;
    border-radius: $sm-radius;
    font-size: 22px;
    cursor: pointer;
    background-color: $theme-bg-color;
    &:hover,
    &.checked {
      background-color: $theme-bg-color-deep;
    }
  }
}
</style>
