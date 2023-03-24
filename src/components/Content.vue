<script setup lang="ts">
const chatMessages = ref<{
  content: string
  role: 'user' | 'assistant' | 'system'
}[]>([])
</script>

<template>
  <div rounded-md bg-white>
    content
    <div v-for="item, i in chatMessages" :key="i">
      {{ item.content }}
    </div>
    <!-- <div flex px-4 fixed bottom-5>
      <input
        class="
      text-slate-400 placeholder:text-slate-400 placeholder:opacity-30 bg-slate-500/40 border-0 text-lg outline-none rounded w-full h-full px-3
      "
        type="text"
      >
      <div btn>
        hi
      </div>
    </div> -->
  </div>
</template>
