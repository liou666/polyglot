<script setup lang="ts">
import Modal from './widgets/Modal.vue'
import NewChat from './NewChat.vue'
import Setting from './Setting.vue'
const isDark = useDark()
const toggleDark = useToggle(isDark)
const addVisible = ref(false)
const settingVisible = ref(false)
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
    <div nav-item @click="settingVisible = true">
      <i icon-btn i-carbon:settings />
      <span>Setting</span>
    </div>
  </div>

  <Modal v-model:visible="addVisible" class="dark:bg-[#111111] bg-white" center max-w-120 p6>
    <NewChat @close="addVisible = false" />
  </Modal>

  <Modal v-model:visible="settingVisible" h20 class="dark:bg-[#111111] bg-white" center max-w-80 p6>
    <Setting />
  </Modal>
</template>
