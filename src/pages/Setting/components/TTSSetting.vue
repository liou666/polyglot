<script setup lang="ts">
import { azureRegions } from '@/config'
const sk = ref('')
const chatRememberCount = ref('10')

const isAlwaysRecognition = ref(false)
</script>

<template>
  <div border border-gray-500 border-style-solid>
    <section border-0 border-gray-500 border-b-1 border-style-solid>
      <div center-y justify-between m-2 pr-2>
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
          v-model="sk"
          select-settings
          w-180px
          placeholder="sk-xxxxxxxxxx"
        >
          <option value="3.5">
            Azure
          </option>
        </select>
      </div>
      <div center-y justify-between m-2 pr-2>
        <label my-1 block for="">Azure 区域</label>
        <select
          v-model="sk"
          w-180px
          select-settings
        >
          <option v-for="item in azureRegions" :key="item" :value="item">
            {{ item }}
          </option>
        </select>
      </div>
      <div center-y justify-between m-2 pr-2>
        <div center-y>
          <label mr-1 my-1 block for="">Azure Access Key</label>
        </div>
        <input placeholder="xxxxxxxxxx" rounded border-gray-500 border-1 block p-2 type="text" class="">
      </div>
    </section>

    <section>
      <div center-y justify-between m-2 pr-2>
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
