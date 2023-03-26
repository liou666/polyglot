<script setup lang="ts">
import Button from '@/components/widgets/Button.vue'

import { generateDashboardInfo, generateText } from '@/server/api'
import { useScroll } from '@/hooks'
// states
const chatMessages = ref<ChatMessage[]>([])
const message = ref('')
const loading = ref(false)

// hooks
const { el, scrollToBottom } = useScroll()

// effects
watch(chatMessages.value, () => nextTick(() => scrollToBottom()))

// methods
const roleClass = (role: string) => {
  switch (role) {
    case 'user':
      return 'bg-gradient-to-br from-green-400 to-blue-300 rounded-full p-4'
    case 'assistant':
      return 'bg-gradient-to-br from-blue-300 to-red-600 rounded-full p-4'
    case 'system':
      return 'bg-gray-500'
  }
}
const onSubmit = async () => {
  if (!message.value) return
  chatMessages.value.push({
    content: message.value,
    role: 'user',
  })
  message.value = ''
  loading.value = true
  const res = await generateText(chatMessages.value)
  chatMessages.value.push({
    content: res,
    role: 'assistant',
  })
  loading.value = false
}
</script>

<template>
  <div flex flex-col p-2 rounded-md bg-white dark="bg-#1e1e1e">
    <div ref="el" class="hide-scrollbar flex-1 overflow-auto">
      <div
        v-for="item, i in chatMessages"
        :key="i"
        center-y odd:flex-row-reverse
      >
        <div :class="roleClass(item.role)" />
        <div relative>
          <p mx-2 px-2 py-1 chat-box>
            {{ item.content }}
          </p>
        </div>
      </div>
    </div>

    <div class="flex h-10 w-[-webkit-fill-available] mt-1">
      <Button
        mr-1
        i-carbon:microphon
      >
        <i i-carbon:microphone />
      </Button>
      <input
        v-if="!loading"
        v-model="message"
        type="text"
        placeholder="Type your message here..."
        input-box p-3 flex-1
      >
      <div v-else class="loading-btn">
        AI Is Thinking...
      </div>
      <Button
        :disabled="loading"
        mx-1
        @click="onSubmit"
      >
        <i i-carbon:send-alt />
      </Button>
      <Button
        :disabled="loading"
        @click="chatMessages = []"
      >
        <i i-carbon:trash-can />
      </Button>
    </div>
  </div>
</template>
