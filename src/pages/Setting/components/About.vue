<script setup lang="ts">
import { shell } from 'electron'
import { version } from '@/../package.json'
</script>

<template>
  <div font-mono>
    <section class="main-section">
      <div class="section-item">
        <div center-y>
          <label mr-1 for="">问题反馈</label>
        </div>
        <div class="center-y" @click="shell.openExternal('https://github.com/liou666/polyglot/issues')">
          <i w-6 h-6 icon-btn i-carbon:logo-github />
        </div>
      </div>
      <div class="section-item">
        <div center-y>
          <label mr-1 for="">QQ交流群</label>
        </div>
        <span>
          724145044
        </span>
      </div>
      <div class="section-item">
        <div center-y>
          <label mr-1 for="">版本号</label>
        </div>
        <span>
          V{{ version }}
        </span>
      </div>
    </section>
    <section class="main-section p2">
      <div flex>
        <div center-y>
          开源不易，如果觉得项目对你有帮助的话，欢迎给作者一些支持😊
        </div>
      </div>
    </section>
    <div mt-2>
      <img width="150" src="/donate/weixin.jpg" alt="">
    </div>
  </div>
</template>

<style scoped>
  .main-section{
   @apply bg-gray-500/10 rounded
  }
  .main-section .section-item{
    @apply rounded center-y justify-between m-2 p2 border-0 border-gray-500/20 border-b-1 border-style-solid
  }
  .main-section input {
   @apply w-180px py-1 px-2  box-border rounded border-gray-500 border-1 block
  }
  .main-section select {
    @apply w-180px py-1 px-2 select-settings

  }
</style>

