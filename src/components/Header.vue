<script setup lang="ts">
import { shell } from 'electron'
</script>

<template>
  <header class="bg-#fff dark:bg-#1f262a">
    <h3 center-y text-2xl>
      <div w-10 m-1 mt-2>
        <!-- 🤖️ -->
        <img w-full src="/favicon.ico" alt="">
      </div>
      <span select-none class="text-gradient ">Polyglot</span>
    </h3>
    <div class="center-y" @click="shell.openExternal('https://github.com/liou666')">
      <i w-6 h-6 icon-btn i-carbon:logo-github />
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
