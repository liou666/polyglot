<script setup lang="ts">
const { name, desc, active, avaterUrl, canEdit } = defineProps<{
  name: string
  desc: string
  active: boolean
  avaterUrl: string
  canEdit: boolean
}>()
const emit = defineEmits<{
  (event: 'delete',): void
}>()

const handleWidgetClick = (event: MouseEvent) => {
  event.stopPropagation()
  emit('delete')
}
</script>

<template>
  <div
    p-2 cursor-pointer center-y relative
    m-2 rounded duration-300 shadow-sm
    dark="bg-gray-700/80 hover:bg-gray-500/80"
    bg="gray-400/20 hover:gray-500/20"
    :class="{ 'bg-gradient-to-r from-purple-400 via-pink-500 to-pink-500 dark:bg-gray-500/80! shadow-lg': active }"
  >
    <div mr-2>
      <div w-10 h-10>
        <img object-fill h-full w-full rounded-full :src="avaterUrl" alt="avater">
      </div>
    </div>
    <div>
      <div max-w-28 :title="name" truncate text-lg font-500>
        {{ name }}
      </div>
      <div truncate :title="desc" max-w-28 text-sm font-300>
        {{ desc }}
      </div>
    </div>
    <template v-if="canEdit">
      <div v-if="active" absolute right-2 top-2 @click=" handleWidgetClick($event)">
        <i w-4 h-4 icon-btn i-carbon:trash-can />
      </div>
    </template>
  </div>
</template>
