<script setup lang="ts">
import Button from '@/components/widgets/Button.vue'
import { generateText } from '@/server/api'
import { getOpenAzureKey, getOpenAzureRegion, getOpenKey, getOpenProxy, verifyOpenKey } from '@/utils'
import { useConversationStore } from '@/stores'

// const systemMessage: SystemMessage = {
//   role: 'system',
//   content: 'I want you to act as a spoken English teacher and improver. I will speak to you in English and you will reply to me in English to practice my spoken English. I want you to keep your reply neat, limiting the reply to 100 words. I want you to strictly correct my grammar mistakes, typos, and factual errors. I want you to ask me a question in your reply. Now let\'s start practicing, you could ask me a question first. Remember, I want you to strictly correct my grammar mistakes, typos, and factual errors.',
// }
// hooks
const store = useConversationStore()
const { el, scrollToBottom } = useScroll()
const {
  language,
  voiceName,
  isRecognizing,
  startRecognizeSpeech,
  stopRecognizeSpeech,
  textToSpeak,
} = useSpeechService(getOpenAzureKey(), getOpenAzureRegion())

// states
const message = ref('') // input message
const text = ref('') // current select message
const loading = ref(false)
const messageLength = computed(() => store.currentChatMessages.length)
const currentKey = computed(() => store.currentKey)

// effects
watch(messageLength, () => nextTick(() => scrollToBottom()))
watch(currentKey, () => {
  language.value = store.currentLanguage as any
  voiceName.value = store.currentVoice as any
})

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
  const key = getOpenKey()
  if (!verifyOpenKey(key)) return alert('请输入正确的API-KEY')
  if (!message.value) return

  store.changeConversations([
    ...store.currentChatMessages,
    { content: message.value, role: 'user' },
  ])
  message.value = ''
  loading.value = true
  try {
    const res = await generateText(store.currentChatMessages, key!, getOpenProxy())
    if (res.error) {
      alert(res.error?.message)
      return loading.value = false
    }
    store.changeConversations([
      ...store.currentChatMessages,
      {
        content: res.choices[0].message.content, role: 'assistant',
      },
    ])
    loading.value = false
  }
  catch (error) {
    loading.value = false
  }
}

function speak(content: string) {
  text.value = content
  textToSpeak(content)
}

const recognize = async () => {
  if (isRecognizing.value) {
    const result = await stopRecognizeSpeech()
    message.value = result
    onSubmit()
  }
  else {
    startRecognizeSpeech()
  }
}
</script>

<template>
  <div flex flex-col p-2 rounded-md bg-white dark="bg-#1e1e1e">
    <div ref="el" class="hide-scrollbar flex-1 overflow-auto">
      <div
        v-for="item, i in store.currentChatMessages"
        :key="i"
        center-y odd:flex-row-reverse
      >
        <div :class="roleClass(item.role)" />
        <div relative>
          <div mx-2>
            <p px-2 py-1 chat-box>
              {{ item.content }}
            </p>
            <p v-if="item.role === 'assistant'" flex>
              <span class="bg-gray-100/20  rounded-lg w-4 py-1 px-3 center" @click="speak(item.content)">
                <i icon-btn rotate-90 i-ic:sharp-wifi />
              </span>
              <span
                class="bg-gray-100/20 ml-1 cursor-pointer rounded-lg w-4 py-1 px-3 center"
              >
                <i icon-btn i-carbon:ibm-watson-language-translator />
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex h-10 w-[-webkit-fill-available] mt-1">
      <Button
        mr-1
        @click="recognize()"
      >
        <i i-carbon:microphone />
      </Button>

      <div v-if="isRecognizing" class="loading-btn">
        isRecognizing
      </div>
      <input
        v-else-if="!loading "
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
        @click="store.changeConversations([])"
      >
        <i i-carbon:trash-can />
      </Button>
    </div>
  </div>
</template>
