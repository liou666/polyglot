<script setup lang="ts">
const { name, desc, active } = defineProps<{
  name: string
  desc: string
  active: boolean
}>()
</script>

<template>
  <div
    p-2 cursor-pointer center-y
    m-2 rounded duration-300
    dark="bg-gray-700/80 hover:bg-gray-500/80"
    bg="gray-500/10 hover:gray-500/20"
    :class="{ 'bg-gray-500/80!': active }"
  >
    <div mr-2>
      <slot />
    </div>
    <div>
      <div text-lg font-500>
        {{ name }}
      </div>
      <div :title="desc" max-w-28 truncate text-sm font-300>
        {{ desc }}
      </div>
    </div>
  </div>
</template>
