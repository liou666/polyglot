<script setup lang="ts">
import Avatar from '@/components/Avatar.vue'
import Tooltip from '@/components/Tooltip.vue'

interface ChatServiceOption{
  name: ServiceProviderProps
  disabled?: boolean
}
const chatServiceOptions: ChatServiceOption[] = [
  { name: 'OpenAI' },
  { name: 'Azure' },
  { name: 'Claude', disabled: true },
]

const openaiModels = [
  'gpt-3.5-turbo',
  // 'gpt-3.5-turbo-0301',
  'gpt-4',
  'gpt-4-0314',
  'gpt-4-32k',
  'gpt-4-32k-0314',
]
const { chatConfig } = useGlobalSetting()
</script>

<template>
  <div>
    <section class="main-section">
      <div class="section-item">
        <div center-y>
          <label mr-1 for="">Chat API 服务</label>
        </div>
        <select
          v-model="chatConfig.apiName"
        >
          <option
            v-for="item in chatServiceOptions" :key="item.name" :disabled="item.disabled" :value="item.name"
          >
            {{ item.disabled ? `${item.name} (计划中)` : item.name }}
          </option>
        </select>
      </div>
    </section>
    <section class="main-section">
      <!-- openai -->
      <template v-if="chatConfig.apiName === 'OpenAI'">
        <div class="section-item">
          <label my-1 for="">GPT 模型</label>
          <select
            v-model="chatConfig.apiModel"
            placeholder="sk-xxxxxxxxxx"
          >
            <option v-for="item in openaiModels" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
        </div>
        <div class="section-item">
          <div center-y>
            <label mr-1 for="">API 密钥</label>
            <!-- <el-tooltip
              class="box-item"
              effect="dark"
              content="兼容api2d的密钥格式"
              placement="bottom"
            >
              <i icon-btn i-carbon:information-square />
            </el-tooltip> -->
          </div>
          <Password v-model:value="chatConfig.apiKey" placeholder="sk-xxxxxxxxxx" />
        </div>
        <div class="section-item">
          <div center-y>
            <label mr-1 for="">OpenAI API 代理</label>
            <Tooltip content="如果网络不能直接访问gpt服务，则必须填写" />
          </div>
          <input
            v-model="chatConfig.apiEndpoint"
            placeholder="https://api.openai.com"
          >
        </div>
      </template>

      <!-- azure -->
      <template v-if="chatConfig.apiName === 'Azure'">
        <div class="section-item">
          <label my-1 for="">GPT 模型</label>
          <select
            v-model="chatConfig.apiModel"
            placeholder="sk-xxxxxxxxxx"
          >
            <option v-for="item in openaiModels" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
        </div>

        <div class="section-item">
          <div center-y>
            <label mr-1 for="">API 密钥</label>
          </div>
          <Password v-model:value="chatConfig.apiKey" placeholder="EXAMPLE" />
        </div>
        <div class="section-item">
          <div center-y>
            <label mr-1 for="">终结点</label>
          </div>
          <input
            v-model="chatConfig.apiEndpoint"
            placeholder="https://xx.openai.azure.com"
          >
        </div>

        <div class="section-item">
          <label my-1 for="">模型部署名称</label>
          <input
            v-model="chatConfig.apiDeploymentName"
            placeholder="EXAMPLE"
          >
        </div>
      </template>
    </section>

    <section class="main-section">
      <div class="m-2 p2 border-0 border-gray-500/20 border-b-1 border-style-solid">
        <div center-y>
          <label mr-1 my-1 for="">联系上下文次数</label>
          <Tooltip content="设置越高，回复的准确率也高，同时也会消耗更多的token" />
          <span ml-auto>
            {{ chatConfig.apiRememberCount }}
          </span>
        </div>
        <div>
          <input v-model="chatConfig.apiRememberCount" class="w-full! " min="1" max="50" type="range">
        </div>
      </div>
      <div m-2 p2>
        <div center-y>
          <label mr-1 my-1 for="">单次回复最大token数</label>
          <Tooltip content="1000 个 token 大约是 750 个英语单词" />
          <span ml-auto>
            {{ chatConfig.apiMaxToken }}
          </span>
        </div>
        <div>
          <input v-model="chatConfig.apiMaxToken" class="w-full! " step="10" min="50" max="4096" type="range">
        </div>
      </div>
    </section>

    <section class="main-section">
      <div m-2 p2>
        <div center-y>
          <label mr-1 my-1 for="">头像</label>
          <Tooltip content="点击图片更换喜欢的头像" />
          <span ml-auto>
            <Avatar v-model:image-url="chatConfig.selfAvatarUrl" w-9 h-9 />
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

