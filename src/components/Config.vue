<template>
  <main class="w-60 bg-white mt-4 p-2 shadow-design rounded">
    <div class="item">
      <h3 class="title mt-0">描边</h3>
      <div>
        <input type="color" />
      </div>
    </div>
    <div class="item">
      <h3 class="title">背景</h3>
      <div>
        <input type="color" />
      </div>
    </div>
    <div class="item">
      <h3 class="title">填充</h3>
      <div class="flex">
        <label for="fill-0" title="实心" class="label">
          <input type="radio" name="group" id="fill-0" value="go" class="hidden">
          <div class="iconfont w-full h-3 bg-black"></div>
        </label>
        <label for="fill-1" title="纹理" class="label">
          <input type="radio" name="group" id="fill-1" value="go" class="hidden">
          <div class="iconfont w-full h-3 bg-black"></div>
        </label>
      </div>
    </div>
    <div class="item">
      <h3 class="title">描边样式</h3>
      <div class="flex">
        <label for="stroke-0" title="实心" class="label">
          <input type="radio" name="group" id="stroke-0" value="go" class="hidden">
          <div class="iconfont w-full h-3 bg-black"></div>
        </label>
        <label for="stroke-1" title="纹理" class="label">
          <input type="radio" name="group" id="stroke-1" value="go" class="hidden">
          <div class="iconfont w-full h-3 bg-black"></div>
        </label>
      </div>
    </div>
    <div class="item">
      <h3 class="title">线条风格</h3>
      <div class="flex">
        <label for="line-0" title="实心" class="label">
          <input type="radio" name="group" id="line-0" value="go" class="hidden">
          <div class="iconfont w-full h-3 bg-black"></div>
        </label>
        <label for="line-1" title="纹理" class="label">
          <input type="radio" name="group" id="line-1" value="go" class="hidden">
          <div class="iconfont w-full h-3 bg-black"></div>
        </label>
      </div>
    </div>
    <div class="item">
      <h3 class="title">边角</h3>
      <div class="flex">
        <label for="round-0" title="实心" class="label">
          <input type="radio" name="group" id="round-0" value="go" class="hidden">
          <div class="iconfont w-full h-3 bg-black"></div>
        </label>
        <label for="round-1" title="纹理" class="label">
          <input type="radio" name="group" id="round-1" value="go" class="hidden">
          <div class="iconfont w-full h-3 bg-black"></div>
        </label>
      </div>
    </div>
    <div class="item">
      <h3 class="title">透明度</h3>
      <div>
        <input type="range" name="" id="" class="w-full">
      </div>
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

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
@layer components {
  .title {
    @apply text-xs font-bold rounded my-1.5
  }
  .label {
    @apply block w-12 bg-theme-color rounded ml-1.5 first:ml-0 p-2
  }
  .action {
    @apply text-xl leading-5 max-w-min bg-theme-color rounded ml-1.5 first:ml-0 p-2
  }
}
</style>
