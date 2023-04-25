<script lang="ts" inherit-attrs="false" setup>
const { value } = defineProps<{ value: string }>()
const emit = defineEmits<{
  (event: 'update:value', value: string): void
}>()
const isPassword = ref(true)
const handleChange = ($event: Event) => {
  emit('update:value', ($event.target as any).value)
}
</script>

<template>
  <div h-full relative>
    <input w-180px py-1 px-2 box-border rounded border-gray-500 border-1 block :value="value" v-bind="$attrs" class="pr-6!" :type="isPassword ? 'password' : 'text'" @input="handleChange($event)">
    <i v-if="isPassword" bg-gray-500 top-1 right-1 absolute icon-btn i-carbon:view-off @click="isPassword = !isPassword" />
    <i v-else bg-gray-500 top-1 right-1 absolute icon-btn i-carbon:view @click="isPassword = !isPassword" />
  </div>
</template>
