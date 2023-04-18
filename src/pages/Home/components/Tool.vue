<script setup lang="ts">
import { ipcRenderer } from 'electron'
import { getOpenAzureKey, getOpenAzureRegion } from '@/utils'

const isDark = useDark()
const toggleDark = useToggle(isDark)
const addVisible = ref(false)
const settingVisible = ref(false)

const { allVoices } = useSpeechService(getOpenAzureKey(), getOpenAzureRegion())
</script>

<template>
  <div py-1>
    <div
      nav-item
      @click="() => toggleDark()"
    >
      <i icon-btn dark:i-carbon-moon i-carbon:sun />
      <span v-if="isDark">Light Mode</span>
      <span v-else>Dark Mode</span>
    </div>
    <div
      nav-item
      @click="addVisible = true"
    >
      <i icon-btn i-ic:baseline-person-add-alt />
      <span>New Chat</span>
    </div>
    <div
      nav-item @click=" ipcRenderer.send('open-settings-window')
      "
    >
      <i icon-btn i-carbon:settings />
      <span>Setting</span>
    </div>
  </div>

  <Modal v-model:visible="addVisible" :z-index="2" class="dark:bg-[#111111] bg-white" center max-w-120 p6>
    <NewChat :all-voices="allVoices as any" @close="addVisible = false" />
  </Modal>

  <Modal v-model:visible="settingVisible" class="dark:bg-[#111111] bg-white" center p6>
    <Setting />
  </Modal>
</template>
