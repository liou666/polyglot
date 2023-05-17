<script setup lang="ts">
import Button from '@/components/Button.vue'
import { generatAnalysis, generatTranslate, generateText } from '@/server/api'
import { base64ToBlob, blobToBase64, verifyOpenKey } from '@/utils'
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
const { selfAvatar, openKey, chatRememberCount, autoPlay } = useGlobalSetting()

const {
  language,
  voiceName,
  rate,
  style,
  isRecognizing,
  isPlaying,
  startRecognizeSpeech,
  isRecognizReadying,
  stopRecognizeSpeech,
  ssmlToSpeak,
  isSynthesizing,
  audioBlob,
  player,
} = useSpeechService({ langs: store.allLanguage as any, isFetchAllVoice: false })

// states
const message = ref('') // input message
const text = ref('') // current select message
const translates = ref<Translates>({}) // translate result
const analysisResults = ref<Translates>({}) // analysis result
const isTranslating = ref(false) // translate loading
const analysisLoading = ref(false) // analysis loading

const speakIndex = ref(0) // record speak
const translateIndex = ref(0) // record translate
const analysisIndex = ref(0) // record analysis

const messageLength = computed(() => store.getConversationsByCurrentProps('chatMessages').length)
const chatMessages = computed(() => store.getConversationsByCurrentProps('chatMessages').slice(1))// 除去第一条系统设置的消息
const currentChatMessages = computed(() => store.getConversationsByCurrentProps('chatMessages'))
const currentKey = computed(() => store.currentKey)
const currentName = computed(() => store.getConversationsByCurrentProps('name'))
const currentAvatar = computed(() => store.getConversationsByCurrentProps('avatar'))
const currentLanguage = computed(() => store.getConversationsByCurrentProps('language'))
const currentVoice = computed(() => store.getConversationsByCurrentProps('voice'))
const currentRate = computed(() => store.getConversationsByCurrentProps('rate'))
const currentVoiceStyle = computed(() => store.getConversationsByCurrentProps('voiceStyle'))

useTitle(currentName)

// 设置空格快捷键
useEventListener(document, 'keydown', (e) => {
  if (store.loading || isRecognizing.value || isRecognizReadying.value || e.code !== 'Space' || !store.isMainActive) return
  message.value = ''
  stopAllSpeaker() // 开启语音识别时停止所有语音播放
  startRecognizeSpeech((textSlice) => {
    message.value += textSlice || ''
  })
})

useEventListener(document, 'keyup', async (e) => {
  if ((!isRecognizing.value && !isRecognizReadying.value) || e.code !== 'Space' || store.loading || !store.isMainActive) return
  console.log('stop')
  await stopRecognizeSpeech()
  onSubmit(true)
})

onMounted(() => {
  setTimeout(() => {
    scrollToBottom()
  }, 1000)
})

// effects
watch(messageLength, () => nextTick(() => scrollToBottom()))
watch(currentKey, () => {
  isPlaying.value = false
  language.value = currentLanguage.value as any
  voiceName.value = currentVoice.value
  rate.value = currentRate.value
  style.value = currentVoiceStyle.value
  nextTick(scrollToBottom)
}, {
  immediate: true,
})

enum FetchType {
  chat = 'chat',
  translate = 'translate',
  analysis = 'analysis'
}
// methods
const fetchResponse = async (prompt: ChatMessage[] | string, type: FetchType = FetchType.chat) => {
  let content
  try {
    let result
    if (type === FetchType.translate) { // 翻译
      result = await generatTranslate(prompt as string) as any
    }
    else if (type === FetchType.chat) { // chat
      result = await generateText(prompt as ChatMessage[]) as any
    }
    else if (type === FetchType.analysis) { // analysis
      result = await generatAnalysis(prompt as string) as any
    }

    if (result.error) alert(result.error?.message)
    else if (result?.object === 'error') alert(result?.message) // 兼容 api2d
    else content = result.choices[0].message.content
  }
  catch (error: any) {
    if (error.code === 20)
      alert('[Error] 请求超时，请检查网络连接或代理')
    else
      alert(error.message)
  }
  return content
}

async function onSubmit(fromRecognize = false) {
  if (!verifyOpenKey(openKey.value)) return alert('请输入正确的API-KEY')
  if (!message.value) return

  store.changeConversations([
    ...currentChatMessages.value,
    { content: message.value, role: 'user', audioBlob: fromRecognize ? await blobToBase64(audioBlob.value) : '' },
  ])
  const tempCurrentChatMessages = chatMessages.value.map(x => ({ content: x.content, role: x.role })) // 发送的请求中需去除audioBlob
  const systemMessage = currentChatMessages.value[0]
  const relativeMessage = tempCurrentChatMessages.slice(-(Number(chatRememberCount.value))) // 保留最近的几条消息
  const prompts = [systemMessage, ...relativeMessage] as ChatMessage[]

  message.value = ''
  store.changeLoading(true)

  const content = await fetchResponse(prompts)

  if (content) {
    store.changeConversations([
      ...currentChatMessages.value,
      {
        content, role: 'assistant',
      },
    ])
    if (autoPlay.value)
      speakByAI(content, chatMessages.value.length - 1)
  }
  else {
    store.changeConversations(currentChatMessages.value.slice(0, -1))
  }

  store.changeLoading(false)
}

// user speak
let audio = new Audio()

// 停止AI的语音播放
function stopUserSpeaker() {
  audio.pause()
  audio.currentTime = 0
  isPlaying.value = false
}

// 停止User的语音播放
function stopAISpeaker() {
  player.value.pause()
  isPlaying.value = false
  isSynthesizing.value = false
}

function stopAllSpeaker() {
  stopUserSpeaker()
  stopAISpeaker()
}

// user speak
function speakByUser(audioData: string, index: number) {
  if (isPlaying.value || isSynthesizing.value) {
    stopAllSpeaker()
    if (speakIndex.value === index) return // 点击同一个按钮,则不再重复播放
  }
  speakIndex.value = index
  audio = new Audio(URL.createObjectURL(base64ToBlob(audioData)))
  audio.play()
  audio.onplay = () => {
    isPlaying.value = true
  }

  audio.onended = () => {
    isPlaying.value = false
    speakIndex.value = -1
  }
}

// assistant speak
function speakByAI(content: string, index: number) {
  if (isPlaying.value || isSynthesizing.value) {
    stopAllSpeaker()
    if (speakIndex.value === index) return // 点击同一个按钮,则不再重复播放
  }
  speakIndex.value = index
  text.value = content
  ssmlToSpeak(content)
}

const recognize = async () => {
  try {
    console.log('isRecognizing', isRecognizing.value)
    if (isRecognizing.value) {
      await stopRecognizeSpeech()
      onSubmit(true)
      console.log('submit', message.value)
      return
    }
    message.value = ''

    stopAllSpeaker() // 开启语音识别时停止所有语音播放
    startRecognizeSpeech((textSlice) => {
      message.value += textSlice || ''
    })
  }
  catch (error) {
    alert(error)
  }
}

const translate = async (text: string, i: number) => {
  translateIndex.value = i
  const key = text + i
  if (translates.value[key])
    return translates.value[key].isShow = !translates.value[key].isShow

  isTranslating.value = true

  const content = await fetchResponse(text, FetchType.translate)

  if (!content) return (isTranslating.value = false)

  translates.value = {
    ...translates.value,
    [key]: { result: content, isShow: true },
  }
  isTranslating.value = false
}

async function grammarAnalysis(text: string, i: number) {
  analysisIndex.value = i
  const key = text + i
  if (analysisResults.value[key])
    return analysisResults.value[key].isShow = !analysisResults.value[key].isShow

  analysisLoading.value = true

  const content = await fetchResponse(text, FetchType.analysis)

  if (!content) return (analysisLoading.value = false)

  analysisResults.value = {
    ...analysisResults.value,
    [key]: { result: content, isShow: true },
  }
  analysisLoading.value = false
}
</script>

<template>
  <div flex flex-col p-2 rounded-md bg-white dark="bg-#1e1e1e" shadow-sm>
    <div ref="el" class="hide-scrollbar flex-1 overflow-auto">
      <template v-if="chatMessages.length">
        <div
          v-for="item, i in chatMessages"
          :key="i"
          center-y
          :class="item.role === 'user' ? 'flex-row-reverse w-[75%] ml-[25%]' : 'w-[75%]'"
        >
          <div class="w-10 h-10">
            <img w-full h-full object-fill rounded-full :src="item.role === 'user' ? selfAvatar : currentAvatar" alt="">
          </div>
          <div style="flex-basis:fit-content" mx-2>
            <p p-2 my-2 chat-box>
              {{ item.content }}
            </p>
            <p v-show=" translates[item.content + i]?.isShow " p-2 my-2 chat-box>
              {{ translates[item.content + i]?.result }}
            </p>

            <p v-show="item.role === 'user' && analysisResults[item.content + i]?.isShow " p-2 my-2 chat-box>
              {{ analysisResults[item.content + i]?.result }}
            </p>

            <!-- assistant -->
            <p v-if="item.role === 'assistant'" mt-2 flex>
              <template v-if="speakIndex !== i">
                <span class="chat-btn" @click="speakByAI(item.content, i)">
                  <i icon-btn rotate-90 i-ic:sharp-wifi />
                </span>
              </template>
              <template v-else>
                <span v-if="isSynthesizing || isPlaying" class="chat-btn" @click="stopAISpeaker()">
                  <i icon-btn rotate-90 i-svg-spinners:wifi-fade />
                </span>
                <span v-else class="chat-btn" @click="speakByAI(item.content, i)">
                  <i icon-btn rotate-90 i-ic:sharp-wifi />
                </span>
              </template>
              <span v-if="!isTranslating || translateIndex !== i" ml-1 class="chat-btn" @click="translate(item.content, i)">
                <i icon-btn i-carbon:ibm-watson-language-translator />
              </span>
              <span v-else ml-1 class="chat-btn">
                <i icon-btn i-eos-icons:bubble-loading />
              </span>
            </p>

            <!-- user -->
            <p v-else justify-end mt-2 flex>
              <template v-if="item.audioBlob">
                <template v-if="speakIndex !== i">
                  <span class="chat-btn mr-1" @click="speakByUser(item.audioBlob, i)">
                    <i icon-btn rotate-270 i-ic:sharp-wifi />
                  </span>
                </template>
                <template v-else>
                  <span v-if="isPlaying" class="chat-btn mr-1" @click="stopUserSpeaker()">
                    <i icon-btn rotate-270 i-svg-spinners:wifi-fade />
                  </span>
                  <span v-else class="chat-btn mr-1" @click="speakByUser(item.audioBlob, i)">
                    <i icon-btn rotate-270 i-ic:sharp-wifi />
                  </span>
                </template>
              </template>
              <span v-if="!analysisLoading || analysisIndex !== i" class="chat-btn" @click="grammarAnalysis(item.content, i)">
                <i icon-btn i-ic:outline-lightbulb />
              </span>
              <span v-else class="chat-btn">
                <i icon-btn i-eos-icons:bubble-loading />
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
        :disabled="isRecognizReadying || store.loading"
        @click="recognize()"
      >
        <i v-if="isRecognizReadying" i-eos-icons:bubble-loading />
        <i v-else i-carbon:microphone />
      </Button>

      <div v-if="isRecognizing" class="loading-btn">
        识别中，请讲话
        <i icon-btn i-eos-icons:three-dots-loading />
      </div>
      <div v-else-if="isRecognizReadying" class="loading-btn">
        录音设备准备中
        <i icon-btn i-eos-icons:three-dots-loading />
      </div>
      <input
        v-else-if="!store.loading"
        v-model="message"
        type="text"
        placeholder="Type your message here..."
        input-box
        p-3 flex-1
        @blur="store.changeMainActive(true)" @focus="store.changeMainActive(false)" @keypress.enter="() => onSubmit()"
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
