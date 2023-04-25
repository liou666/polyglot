<script setup lang="ts">
import Card from './Card.vue'
import Tool from './Tool.vue'
import type { Key } from '@/stores'
import { useConversationStore } from '@/stores'
const store = useConversationStore()

const handleCardClick = (key: Key) => {
  if (store.loading)
    return alert('Please wait for the current operation to complete')
  store.changeCurrentKey(key)
}

const handleDelete = (key: Key) => {
  if (store.loading)
    return alert('Please wait for the current operation to complete')
  store.deleteConversation(key)
}
</script>

<template>
  <nav class="rounded-md bg-#fff dark:bg-#1d262a h-[calc(100vh-78px)] shadow-sm">
    <div h-full flex flex-col p-1>
      <div class="hide-scrollbar overflow-y-auto flex-1 ">
        <Card
          v-for="item, i in store.allPeople"
          :key="i"
          :avater-url="item.avatar"
          :desc="item.desc"
          :name="item.name"
          :active="store.currentKey === item.key"
          :can-edit="!item.isDefault"
          @click="handleCardClick(item.key)"
          @delete="handleDelete(item.key)"
        />
      </div>
      <div w-full h-0.2 bg-gray-200 dark:bg-gray-700 />
      <Tool />
    </div>
  </nav>
</template>
