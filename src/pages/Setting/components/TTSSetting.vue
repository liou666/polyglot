<script setup lang="ts">
import { azureRegions } from '@/config'
const { azureRegion, azureKey, isAlwaysRecognition, ttsPassword, autoPlay, voiceApiName } = useGlobalSetting()
</script>

<template>
  <div>
    <section class="main-section">
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
          <el-tooltip
            effect="dark"
            content="填写后将绕过访问密码，使用自己的Azure Access Key"
            placement="bottom"
          >
            <i icon-btn i-carbon:information-square />
          </el-tooltip>
        </div>
        <Password v-model:value="azureKey" placeholder="azure key" />
      </div>
      <div class="section-item">
        <div center-y>
          <label mr-1 my-1 block for="">访问密码</label>
          <el-tooltip
            effect="dark"
            content="输入访问密码后无需填写Azure Access Key"
            placement="bottom"
          >
            <i icon-btn i-carbon:information-square />
          </el-tooltip>
        </div>
        <Password v-model:value="ttsPassword" placeholder="access password" />
      </div>
    </section>

    <section class="main-section">
      <!-- <div class="section-item">
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
      </div> -->
      <div class="section-item">
        <div center-y>
          <label mr-1 for="">回复后自动播放音频</label>
        </div>
        <el-switch v-model="autoPlay" />
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

