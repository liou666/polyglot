<script setup lang="ts">
import InputKit from '@/components/widgets/InputKit.vue'
const openKey = useLocalStorage('openKey', '')
</script>

<template>
  <header class="bg-#ecf7fd dark:bg-#1f262a">
    <h3 text-2xl>
      🤖️ <span class="text-gradient ">Polyglot</span>
    </h3>
    <div class="center-y">
      <InputKit v-model="openKey">
        <template #mainText>
          Self Key
        </template>
      </InputKit>
    </div>
  </header>
</template>

<style scoped>
 .text-gradient {
    background-image: var(--accent-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
</style>
