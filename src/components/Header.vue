<script setup lang="ts">
// defineProps<{}>()
const [isKeyMode, toggle] = useToggle(false)
const openKey = useLocalStorage('openKey', '')
</script>

<template>
  <header bg-white>
    <h3 animate-bounce>
      Logo
    </h3>
    <div class="center-y py-2">
      <i mr-2 rotate-115 i-ic:baseline-key />
      <div v-if="isKeyMode" w-55>
        <input
          v-model="openKey"
          type="password"
          class="input"
        >
        <i icon-btn i-carbon-checkmark @click="toggle()" />
        <i icon-btn i-carbon-close @click="toggle()" />
      </div>
      <div
        v-else
        font-sans
        cursor-pointer
        w-55 @click="toggle()"
      >
        Key
      </div>
    </div>
  </header>
</template>
