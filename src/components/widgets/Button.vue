<script setup lang="ts">
const emit = defineEmits(['click'])
</script>

<template>
  <button
    border-0 btn
    @click="emit('click')"
  >
    <slot />
  </button>
</template>
