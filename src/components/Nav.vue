<script setup lang="ts">
import Card from './widgets/Card.vue'
import type { Key } from '@/stores'
import { useConversationStore } from '@/stores'
import InputKit from '@/components/widgets/InputKit.vue'
import { OPEN_KEY, OPEN_PROXY } from '@/constant'

const openKey = useLocalStorage(OPEN_KEY, '')
const proxy = useLocalStorage(OPEN_PROXY, '')
const isDark = useDark()
const toggleDark = useToggle(isDark)
const store = useConversationStore()

const handleCardClick = (key: Key) => {
  if (store.loading)
    return alert('Please wait for the current operation to complete')
  store.changeCurrentKey(key)
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
          :name="item.key"
          :active="store.currentKey === item.key"
          @click="handleCardClick(item.key)"
        />
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
          <InputKit v-model="proxy" input-type="text">
            <template #mainIcon>
              <i i-carbon:server-proxy />
            </template>
            <template #mainText>
              Proxy
            </template>
          </InputKit>
        </div>
        <div nav-item>
          <InputKit v-model="openKey">
            <template #mainText>
              OpenAi Key
            </template>
          </InputKit>
        </div>
      </div>
    </div>
  </nav>
</template>
