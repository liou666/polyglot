<script setup lang="ts">
import Aside from '@/components/Nav.vue'
import Content from '@/components/Content.vue'
import Header from '@/components/Header.vue'
console.log('[App.vue]', `Electron ${process.versions.electron}!`)
</script>

<template>
  <div class="layout m-1">
    <Header />
    <Aside />
    <Content class="chat-wrap hide-scrollbar" />
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-rows: 56px 1fr;
  grid-template-columns: 200px 1fr;
  height: 100%;
  margin: 0;
  /* column-gap: .4rem; */
}

header {
  grid-column: 1 / 3;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
}

nav {
  grid-row: 2;
  margin: .7rem;
  width: 200px;
}

.chat-wrap {
  grid-row: 2;
  overflow: auto;
  margin: .7rem;
  margin-left: 1.2rem;
  /* margin-top: 0; */
}
</style>
