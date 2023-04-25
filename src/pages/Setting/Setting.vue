<script setup lang="ts">
import OpenSetting from './components/OpenSetting.vue'
import TTSSetting from './components/TTSSetting.vue'
import About from './components/About.vue'

useDark()
useTitle('设置界面')

const settings = [{
  icon: 'i-ic:round-chat',
  label: '聊天',
  component: OpenSetting,
}, {
  icon: 'i-ic:outline-deblur',
  label: '语音',
  component: TTSSetting,
},
{
  icon: 'i-ic:round-emoji-people',
  label: '关于',
  component: About,
}]

const currentSettingIndex = ref(0)
</script>

<template>
  <div flex h-full box-border p-2>
    <aside p-2 class="dark:bg-gray-500/20 bg-#fff" w-38 mr-1 rounded>
      <div
        v-for="item, i in settings"
        :key="i"
        class="hover:bg-gray-500/10"
        :class="{ 'bg-gray-500/10 dark:bg-gray-5/30 dark:shadow-lg ': currentSettingIndex === i }"
        p-2 center-y rounded cursor-pointer my-1
        @click="currentSettingIndex = i"
      >
        <i mr-2 :class="item.icon" />
        <span>{{ item.label }}</span>
      </div>
    </aside>
    <section class="dark:bg-gray-500/10 bg-#fff rounded flex-1">
      <header class="border-b-1 border-b-solid border-gray-500/20">
        <div class="text-2xl p-3 font-bold">
          {{ settings[currentSettingIndex].label }}
        </div>
      </header>
      <component :is="settings[currentSettingIndex].component" class="setting-wrapper" />
    </section>
  </div>
</template>

<style>
  .setting-wrapper{
      @apply text-3.6 p-2
  }
</style>

