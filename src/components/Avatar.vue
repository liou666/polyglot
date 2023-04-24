<script setup lang="ts" inherit-attrs="false">
const { maxSize = 2, imageUrl } = defineProps<{ maxSize?: number; imageUrl: string }>()
const emit = defineEmits<{
  (event: 'change', value: string): void
  (event: 'update:imageUrl', value: string): void
}>()

const inputFileElement = ref<HTMLInputElement | null>(null)

const fileChange = (event: Event) => {
  const maxFileSize = maxSize * 1024 * 1024

  const file = (event.target as HTMLInputElement).files![0]
  const acceptImageType = ['image/png', 'image/jpeg']

  if (!file || !acceptImageType.includes(file.type)) {
    alert('仅支持上传png、jpg格式的图片')
    return
  }
  if (file.size > maxFileSize) {
    alert(`图片大小不能超过${maxSize}MB`)
    return
  }

  const reader = new FileReader()
  reader.onload = function () {
    emit('update:imageUrl', reader.result as string)
  }
  reader.readAsDataURL(file)
}
</script>

<template>
  <img v-bind="$attrs" object-fill w-14 h-14 rounded-full :src="imageUrl" alt="" @click="inputFileElement?.click()">
  <input ref="inputFileElement" type="file" name="avatar" class="hidden" accept=".jpg,.png" @change="fileChange($event)">
</template>
