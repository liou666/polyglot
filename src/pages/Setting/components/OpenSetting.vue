<script setup lang="ts">
import { openaiModels } from '@/config'
const sk = ref('')

const chatRememberCount = ref('10')
</script>

<template>
  <div border border-gray-500 border-style-solid>
    <section border-0 border-gray-500 border-b-1 border-style-solid>
      <div center-y justify-between m-2 pr-2>
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
          v-model="sk"
          select-settings
          w-180px
          placeholder="sk-xxxxxxxxxx"
        >
          <option value="3.5">
            openAI
          </option>
        </select>
      </div>

      <div center-y justify-between m-2 pr-2>
        <div center-y>
          <label mr-1 for="">OpenAI API 密钥</label>
        </div>
        <input
          v-model="sk"
          type="password"
          rounded border-gray-500 border-1 block p-2
          placeholder="sk-xxxxxxxxxx"
        >
      </div>
      <div center-y justify-between m-2 pr-2>
        <div center-y>
          <label mr-1 for="">OpenAI API 代理地址</label>
        </div>
        <input
          v-model="sk"
          rounded border-gray-500 border-1 block p-2
          placeholder="https://api.openai.com"
        >
      </div>
      <div center-y justify-between m-2 pr-2>
        <label my-1 for="">OpenAI 模型</label>
        <select
          v-model="sk"
          select-settings
          w-180px
          placeholder="sk-xxxxxxxxxx"
        >
          <option v-for="item in openaiModels" :key="item" :value="item">
            {{ item }}
          </option>
        </select>
      </div>
    </section>

    <section>
      <div m-2 pr-2>
        <div center-y>
          <label mr-1 my-1 for="">联系上下文次数</label>
          <el-tooltip
            class="box-item"
            effect="dark"
            content="设置越高，回复的准确率也高，同时也会消耗更多的token"
            placement="bottom"
          >
            <i icon-btn i-carbon:information-square />
          </el-tooltip>
        </div>
        <div>
          <input v-model="chatRememberCount" min="1" max="100" type="range"> {{ chatRememberCount }}
        </div>
      </div>
    </section>
  </div>
</template>
