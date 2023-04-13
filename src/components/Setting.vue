<script setup lang="ts">
import InputKit from '@/components/widgets/InputKit.vue'
import { OPEN_KEY, OPEN_PROXY } from '@/constant'
const openKey = useLocalStorage(OPEN_KEY, '')
const proxy = useLocalStorage(OPEN_PROXY, '')
</script>

<template>
  <div flex="~ col gap-3" items-center>
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
  </div>
</template>
