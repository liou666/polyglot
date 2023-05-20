<script setup lang="ts">
const { content } = defineProps<{ content: string }>()
</script>

<template>
  <el-tooltip
    effect="dark"
    :content="content"
    placement="bottom"
  >
    <i icon-btn i-carbon:information-square />
  </el-tooltip>
</template>
