<script setup lang="ts">
const { name, desc } = defineProps<{
  name: string
  desc: string
}>()
</script>

<template>
  <div
    p-1 cursor-pointer center-y
    m-1 rounded duration-300
    dark="bg-gray-700 hover:bg-gray-600"
    bg="gray-500/10 hover:gray-500/20"
  >
    <div mr-2>
      <slot />
    </div>
    <div>
      <div text-lg font-500>
        {{ name }}
      </div>
      <div text-sm font-300>
        {{ desc }}
      </div>
    </div>
  </div>
</template>
