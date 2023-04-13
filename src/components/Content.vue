<script setup lang="ts">
import Button from '@/components/widgets/Button.vue'
import { generatTranslate, generateText } from '@/server/api'
import { getAvatarUrl, getAzureTranslateKey, getOpenAzureKey, getOpenAzureRegion, getOpenKey, getOpenProxy, verifyOpenKey } from '@/utils'
import { useConversationStore } from '@/stores'

interface Translates {
  [key: string]: {
    isShow: boolean
    result: string | boolean
  }
}

// hooks
const store = useConversationStore()

const { el, scrollToBottom } = useScroll()
const {
  language,
  voiceName,
  isRecognizing,
  recognizeSpeech,
  textToSpeak,
  isSynthesizing,
} = useSpeechService(getOpenAzureKey(), getOpenAzureRegion(), store.allLanguage as any)

// states
const message = ref('') // input message
const text = ref('') // current select message
const translates = ref<Translates>({}) // translate result
const isTranslating = ref(false) // translate loading

const messageLength = computed(() => store.getConversationsByCurrentProps('chatMessages').length)
const chatMessages = computed(() => store.getConversationsByCurrentProps('chatMessages').slice(1))
const currentChatMessages = computed(() => store.getConversationsByCurrentProps('chatMessages'))
const currentKey = computed(() => store.currentKey)
const currentName = computed(() => store.getConversationsByCurrentProps('name'))
const currentAvatar = computed(() => store.getConversationsByCurrentProps('avatar'))
const currentLanguage = computed(() => store.getConversationsByCurrentProps('language'))
const currentVoice = computed(() => store.getConversationsByCurrentProps('voice'))

useTitle(currentName)

// effects
watch(messageLength, () => nextTick(() => scrollToBottom()))
watch(currentKey, () => {
  language.value = currentLanguage.value as any
  voiceName.value = currentVoice.value as any
})

// methods
const fetchResponse = async (key: string) => {
  let res
  try {
    res = await generateText(currentChatMessages.value, key, getOpenProxy())
  }
  catch (error: any) {
    return alert('[Error] 网络请求超时, 请检查网络或代理')
  }
  if (res.error) return alert(res.error?.message)

  return res.choices[0].message.content
}

const onSubmit = async () => {
  const key = getOpenKey()
  if (!verifyOpenKey(key)) return alert('请输入正确的API-KEY')
  if (!message.value) return

  store.changeConversations([
    ...currentChatMessages.value,
    { content: message.value, role: 'user' },
  ])
  message.value = ''
  store.changeLoading(true)

  const content = await fetchResponse(key)
  if (content) {
    store.changeConversations([
      ...currentChatMessages.value,
      {
        content, role: 'assistant',
      },
    ])
    speak(content)
  }
  else {
    store.changeConversations(currentChatMessages.value.slice(0, -1))
  }

  store.changeLoading(false)
}

function speak(content: string) {
  text.value = content
  textToSpeak(content)
}

const recognize = async () => {
  try {
    isRecognizing.value = true
    store.changeLoading(true)
    const result = await recognizeSpeech()
    isRecognizing.value = false
    store.changeLoading(false)
    message.value = result
    onSubmit()
  }
  catch (error) {
    isRecognizing.value = false
    store.changeLoading(false)
    alert(error)
  }
}

const translate = async (text: string, i: number) => {
  const key = text + i
  if (translates.value[key])
    return translates.value[key].isShow = !translates.value[key].isShow

  isTranslating.value = true
  const result = await generatTranslate({ text, translateKey: getAzureTranslateKey(), toLanguage: 'zh-Hans' })
  translates.value = {
    ...translates.value,
    [key]: { result, isShow: true },
  }
  isTranslating.value = false
}
</script>

<template>
  <div flex flex-col p-2 rounded-md bg-white dark="bg-#1e1e1e" shadow-sm>
    <div ref="el" class="hide-scrollbar flex-1 overflow-auto">
      <template v-if="chatMessages.length">
        <div
          v-for="item, i in chatMessages"
          :key="i"
          center-y odd:flex-row-reverse
        >
          <div class="w-10">
            <img w-full rounded-full :src="item.role === 'user' ? getAvatarUrl('self.png') : currentAvatar" alt="">
          </div>

          <div style="flex-basis:fit-content" mx-2>
            <p p-2 my-2 chat-box>
              {{ item.content }}
            </p>
            <p v-show="item.role === 'assistant' && translates[item.content + i]?.isShow " p-2 my-2 chat-box>
              {{ translates[item.content + i]?.result }}
            </p>

            <p v-if="item.role === 'assistant'" mt-2 flex>
              <span class="chat-btn">
                <i v-if="!isSynthesizing" icon-btn rotate-90 i-ic:sharp-wifi @click="speak(item.content)" />
                <i v-else icon-btn i-eos-icons:bubble-loading />
              </span>
              <span
                class="chat-btn ml-1"
              >
                <i v-if="!isTranslating" icon-btn i-carbon:ibm-watson-language-translator @click="translate(item.content, i)" />
                <i v-else icon-btn i-eos-icons:bubble-loading />
              </span>
            </p>
          </div>
        </div>
      </template>
      <template v-else>
        <div font-italic text-gray-500 center h-full>
          Haven't started the conversation yet, let's start now
        </div>
      </template>
    </div>

    <div class="flex h-10 w-[-webkit-fill-available] mt-1">
      <Button
        mr-1
        :disabled="isRecognizing || store.loading"
        @click="recognize()"
      >
        <i i-carbon:microphone />
      </Button>

      <div v-if="isRecognizing" class="loading-btn">
        isRecognizing
        <i icon-btn i-eos-icons:three-dots-loading />
      </div>
      <input
        v-else-if="!store.loading"
        v-model="message"
        type="text"
        placeholder="Type your message here..."
        input-box
        p-3 flex-1 @keyup.enter="onSubmit"
      >
      <div v-else class="loading-btn">
        AI Is Thinking
        <i icon-btn i-eos-icons:three-dots-loading />
      </div>
      <Button
        :disabled="store.loading"
        mx-1
        @click="onSubmit"
      >
        <i i-carbon:send-alt />
      </Button>
      <Button
        :disabled="store.loading"
        @click="store.cleanCurrentConversations()"
      >
        <i i-carbon:trash-can />
      </Button>
    </div>
  </div>
</template>
