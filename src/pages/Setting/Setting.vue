<script setup lang="ts">
import { OPEN_KEY, OPEN_PROXY } from '@/constant'
const openKey = useLocalStorage(OPEN_KEY, '')
const proxy = useLocalStorage(OPEN_PROXY, '')
const isAlwaysRecognition = useLocalStorage('isAlwaysRecognition', false)
</script>

<template>
  <div class="dark:bg-[#111111] bg-#fff" flex="~ col gap-3" items-center>
    <div flex w-50 text-sm>
      <InputKit v-model="openKey">
        <template #mainIcon>
          <i inline-block mr-1 rotate-115 i-ic:baseline-key />
        </template>
        <template #mainText>
          点击设置OpenAi Key
        </template>
      </InputKit>
    </div>
    <div flex w-50 text-sm>
      <InputKit v-model="proxy" h-4 input-type="text">
        <template #mainIcon>
          <i inline-block mr-1 text-sm i-carbon:server-proxy />
        </template>
        <template #mainText>
          点击设置代理
        </template>
      </InputKit>
    </div>

    <div flex text-sm>
      azure key  <input type="text">
    </div>
    <div flex text-sm>
      region
      <select>
        <option value="">
          1
        </option>
      </select>
    </div>
    <div>
      是否连续识别
      <el-switch v-model="isAlwaysRecognition" />
    </div>
  </div>
</template>
