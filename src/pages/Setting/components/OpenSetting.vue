<script setup lang="ts">
import { openaiModels } from '@/config'
const sk = ref('')

const chatRememberCount = ref('10')
</script>

<template>
  <div border text-3.6 border-gray-500 border-style-solid>
    <section class="bg-gray-500/20" rounded border-0 border-gray-500 border-b-1 border-style-solid>
      <div class="bg-gray-500/20" rounded center-y justify-between m-2 p2>
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
          class="input-select select-settings py-1 px-2 "
          placeholder="sk-xxxxxxxxxx"
        >
          <option value="3.5">
            openAI
          </option>
        </select>
      </div>

      <div class="bg-gray-500/20" rounded center-y justify-between m-2 p2>
        <div center-y>
          <label mr-1 for="">OpenAI API 密钥</label>
        </div>
        <input
          v-model="sk"
          type="password"
          class="input-select py-1 px-2  box-border rounded border-gray-500 border-1 block"
          placeholder="sk-xxxxxxxxxx"
        >
      </div>
      <div class="bg-gray-500/20" rounded center-y justify-between m-2 p2>
        <div center-y>
          <label mr-1 for="">OpenAI API 代理地址</label>
        </div>
        <input
          v-model="sk"
          class="input-select box-border rounded border-gray-500 border-1 block py-1 px-2 "
          placeholder="https://api.openai.com"
        >
      </div>
      <div class="bg-gray-500/20" rounded center-y justify-between m-2 p2>
        <label my-1 for="">OpenAI 模型</label>
        <select
          v-model="sk"
          class="input-select py-1 px-2 select-settings"
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

<style scoped>
  .input-select{
    width: 180px;
  }
</style>
