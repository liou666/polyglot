<script setup lang="ts">
import Card from './widgets/Card.vue'
import { useConversationStore } from '@/stores'

const isDark = useDark()
const toggleDark = useToggle(isDark)
const store = useConversationStore()
</script>

<template>
  <nav class="rounded-md bg-#eaf7fe  dark:bg-#1d262a h-[calc(100vh-78px)]">
    <div h-full flex flex-col p-1>
      <div class="hide-scrollbar overflow-y-auto flex-1 ">
        <Card
          v-for="item, i in store.allPeople"
          :key="i"
          :desc="item.desc"
          :name="item.key"
          :active="store.currentKey === item.key"
          @click="store.changeCurrentKey(item.key)"
        >
          <div rounded-full w-8 h-8 bg-red />
        </Card>
      </div>
      <div w-full h-0.2 bg-gray-200 dark:bg-gray-700 />
      <div py-1>
        <div
          nav-item
          @click="() => toggleDark()"
        >
          <i icon-btn dark:i-carbon-moon i-carbon:sun />
          <span v-if="isDark">Light Mode</span>
          <span v-else>Dark Mode</span>
        </div>
        <div nav-item>
          <i icon-btn i-carbon:settings />
          <span>Setting</span>
        </div>
      </div>
    </div>
  </nav>
</template>
