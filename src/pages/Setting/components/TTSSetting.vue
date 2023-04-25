<script setup lang="ts">
import { azureRegions } from '@/config'
import { AZURE_KEY, AZURE_REGION, IS_ALWAYS_RECOGNITION, VOICE_API_NAME } from '@/constant'

const voiceApiName = useLocalStorage(VOICE_API_NAME, 'Azure')
const azureRegion = useLocalStorage(AZURE_REGION, 'eastasia')
const azureKey = useLocalStorage(AZURE_KEY, '')
const isAlwaysRecognition = useLocalStorage(IS_ALWAYS_RECOGNITION, false)
const ttsPassword = useLocalStorage('ttsPassword', '')
</script>

<template>
  <div>
    <section class="main-section">
      <div class="section-item">
        <div center-y>
          <label mr-1 my-1 block for="">访问密码</label>
          <el-tooltip
            effect="dark"
            content="输入访问密码后可直接使用语音服务"
            placement="bottom"
          >
            <i icon-btn i-carbon:information-square />
          </el-tooltip>
        </div>
        <Password v-model:value="ttsPassword" placeholder="access password" />
      </div>

      <div class="section-item">
        <div center-y>
          <label mr-1 my-1 block for="">语音服务</label>
          <el-tooltip
            class="box-item"
            effect="dark"
            content="目前仅支持Azure服务"
            placement="bottom"
          >
            <i icon-btn i-carbon:information-square />
          </el-tooltip>
        </div>
        <select
          v-model="voiceApiName"
          placeholder="sk-xxxxxxxxxx"
        >
          <option value="Azure">
            Azure
          </option>
        </select>
      </div>
      <div class="section-item">
        <label my-1 block for="">Azure 区域</label>
        <select
          v-model="azureRegion"
        >
          <option v-for="item in azureRegions" :key="item" :value="item">
            {{ item }}
          </option>
        </select>
      </div>
      <div class="section-item">
        <div center-y>
          <label mr-1 my-1 block for="">Azure Access Key</label>
        </div>
        <Password v-model:value="azureKey" placeholder="azure key" />
      </div>
    </section>

    <section class="main-section">
      <div class="section-item">
        <div center-y>
          <label mr-1 for="">沉浸式对话模式</label>
          <el-tooltip
            class="box-item"
            effect="dark"
            content="开启后会持续对话，按下esc键取消对话"
            placement="bottom"
          >
            <i icon-btn i-carbon:information-square />
          </el-tooltip>
        </div>
        <el-switch v-model="isAlwaysRecognition" />
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

  .main-section .section-item:last-child{
    @apply border-0
  }
  .main-section input{
   @apply w-180px py-1 px-2  box-border rounded border-gray-500 border-1 block
}
  .main-section select {
    @apply w-180px py-1 px-2 select-settings

  }
</style>

