<script setup lang="ts">
import OpenSetting from './components/OpenSetting.vue'
import TTSSetting from './components/TTSSetting.vue'
import { OPEN_KEY, OPEN_PROXY } from '@/constant'
const openKey = useLocalStorage(OPEN_KEY, '')
const proxy = useLocalStorage(OPEN_PROXY, '')
const isAlwaysRecognition = useLocalStorage('isAlwaysRecognition', false)
const isDark = useDark()
const sk = ref('')

useTitle('setting')

const settings = [{
  icon: 'i-ic:round-chat',
  label: 'Api',
}, {
  icon: 'i-ic:outline-deblur',
  label: 'TTS',
},
{
  icon: 'i-ic:round-emoji-people',
  label: '关于',
}]

const chatRememberCount = ref('10')

const currentSettingIndex = ref(0)
</script>

<template>
  <div flex h-full box-border p-2>
    <aside p-2 class="dark:bg-gray-500/20 bg-#fff" w-34 mr-1 rounded>
      <div
        v-for="item, i in settings"
        :key="i"
        class="hover:bg-gray-500/10"
        :class="{ 'bg-gray-500/10 dark:bg-gray-5 dark:shadow-lg ': currentSettingIndex === i }"
        hover:dark:bg-gray-500 p-2 center-y rounded cursor-pointer my-1
        @click="currentSettingIndex = i"
      >
        <i mr-2 :class="item.icon" />
        <span>{{ item.label }}</span>
      </div>
    </aside>
    <section class="dark:bg-gray-500/10 bg-#fff" rounded p-2 flex-1>
      <OpenSetting v-if="currentSettingIndex === 0" />
      <TTSSetting v-if="currentSettingIndex === 1" />
    </section>
  </div>
</template>

<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.el-tabs--left .el-tabs__content {
  height: 100%;
}
</style>
