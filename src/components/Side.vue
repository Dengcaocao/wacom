<template>
  <aside>
    <section class="top">
      <div class="item iconfont icon-shanchu"></div>
      <div class="item iconfont icon-tupianxiazai"></div>
      <div class="item bg-box">
        <input type="color" class="canvas-bg">
      </div>
    </section>
    <config />
  </aside>
</template>

<script setup lang="ts">
import Config from './Config.vue'
</script>

<style scoped lang="scss">
aside {
  position: absolute;
  top: 6px;
  left: 6px;
  .top {
    display: grid;
    grid-template-rows: auto;
    grid-auto-flow: column;
    grid-auto-columns: min-content;
    gap: $sm-gap;
    padding: $sm-gap;
    border-radius: $sm-radius;
    box-shadow: $box-shadow;
    background-color: #fff;
    .item {
      padding: $md-gap;
      border-radius: $sm-radius;
      font-size: 22px;
      font-weight: bolder;
      cursor: pointer;
      background-color: $theme-bg-color;
      &:hover {
        background-color: $theme-bg-color-deep;
      }
      &.bg-box {
        background-color: transparent;
      }
      .canvas-bg {
        width: 24px;
        height: 24px;
      }
    }
  }
}
</style>
