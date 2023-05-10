<script setup lang="ts">
import { ipcRenderer } from 'electron'
import NewChat from './NewChat.vue'
import Setting from '@/pages/Setting/Setting.vue'
import { useConversationStore } from '@/stores'

const addVisible = ref(false)
const settingVisible = ref(false)

const isDark = useDark()
const toggleDark = useToggle(isDark)
const { allVoices, getVoices } = useSpeechService()
const store = useConversationStore()
const debounceFn = useDebounceFn(() => getVoices(), 1500)

const openNewChat = () => {
  addVisible.value = true
  store.changeMainActive(false)
}
const closeNewChat = () => {
  addVisible.value = false
  store.changeMainActive(true)
}

const tempAllVoices = computed(() => allVoices.value)
const { azureKey, azureRegion, ttsPassword } = useGlobalSetting()
watch([azureKey, azureRegion, ttsPassword], () => {
  if (!tempAllVoices.value.length)
    debounceFn()
}, { immediate: true })
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
      @click="openNewChat()"
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
  <Modal v-model:visible="addVisible" :z-index="2" class="dark:bg-[#111111] bg-white" center max-w-120 p6 @close="closeNewChat()">
    <NewChat :key="tempAllVoices.length" :all-voices="tempAllVoices as any" @close="closeNewChat()" />
  </Modal>

  <Modal v-model:visible="settingVisible" class="dark:bg-[#111111] bg-white" center p6>
    <Setting />
  </Modal>
</template>
