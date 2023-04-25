<script setup lang="ts">
import Avatar from '@/components/Avatar.vue'

import { openaiModels } from '@/config'

const { openKey, openProxy, openModel, chatApiName, chatRememberCount, selfAvatar, openMaxTokens } = useGlobalSetting()
</script>

<template>
  <div>
    <section class="main-section">
      <div class="section-item">
        <div center-y>
          <label mr-1 for="">Chat API 服务</label>
          <el-tooltip
            class="box-item"
            effect="dark"
            content="目前仅支持OpenAI服务"
            placement="bottom"
          >
            <i icon-btn i-carbon:information-square />
          </el-tooltip>
        </div>
        <select
          v-model="chatApiName"
        >
          <option value="openAI">
            openAI
          </option>
        </select>
      </div>

      <div class="section-item">
        <div center-y>
          <label mr-1 for="">OpenAI API 密钥</label>
          <el-tooltip
            class="box-item"
            effect="dark"
            content="兼容api2d的密钥格式"
            placement="bottom"
          >
            <i icon-btn i-carbon:information-square />
          </el-tooltip>
        </div>
        <Password v-model:value="openKey" placeholder="sk-xxxxxxxxxx" />
      </div>
      <div class="section-item">
        <div center-y>
          <label mr-1 for="">OpenAI API 代理地址</label>
        </div>
        <input
          v-model="openProxy"
          placeholder="https://api.openai.com"
        >
      </div>
      <div class="section-item">
        <label my-1 for="">OpenAI 模型</label>
        <select
          v-model="openModel"
          placeholder="sk-xxxxxxxxxx"
        >
          <option v-for="item in openaiModels" :key="item" :value="item">
            {{ item }}
          </option>
        </select>
      </div>
    </section>

    <section class="main-section">
      <div class="m-2 p2 border-0 border-gray-500/20 border-b-1 border-style-solid">
        <div center-y>
          <label mr-1 my-1 for="">联系上下文次数</label>
          <el-tooltip
            effect="dark"
            content="设置越高，回复的准确率也高，同时也会消耗更多的token"
            placement="bottom"
          >
            <i icon-btn i-carbon:information-square />
          </el-tooltip>
          <span ml-auto>
            {{ chatRememberCount }}
          </span>
        </div>
        <div>
          <input v-model="chatRememberCount" class="w-full! " min="1" max="50" type="range">
        </div>
      </div>
      <div m-2 p2>
        <div center-y>
          <label mr-1 my-1 for="">max_tokens</label>
          <el-tooltip
            effect="dark"
            content="单次交互所用的最大Token数"
            placement="bottom"
          >
            <i icon-btn i-carbon:information-square />
          </el-tooltip>
          <span ml-auto>
            {{ openMaxTokens }}
          </span>
        </div>
        <div>
          <input v-model="openMaxTokens" class="w-full! " step="10" min="50" max="4096" type="range">
        </div>
      </div>
    </section>

    <section class="main-section">
      <div m-2 p2>
        <div center-y>
          <label mr-1 my-1 for="">头像</label>
          <el-tooltip
            effect="dark"
            content="点击图片更换喜欢的头像"
            placement="bottom"
          >
            <i icon-btn i-carbon:information-square />
          </el-tooltip>
          <span ml-auto>
            <Avatar v-model:image-url="selfAvatar" w-9 h-9 />
          </span>
        </div>
      </div>
    </section>
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

