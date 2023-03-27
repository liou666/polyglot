<script setup lang="ts">
import Button from '@/components/widgets/Button.vue'
import { generateText } from '@/server/api'
import { useScroll } from '@/hooks'
import { Recognition, getKey, verifyKey } from '@/utils'

// states
const chatMessages = ref<ChatMessage[]>([])
const message = ref('')
const loading = ref(false)
const text = ref('')

const recognition = new Recognition('en-US')

// hooks
const { el, scrollToBottom } = useScroll()
const speech = useSpeechSynthesis(text)
const { start } = useSpeechRecognition()

// effects
watch(chatMessages.value, () => nextTick(() => scrollToBottom()))

// methods
function play(content: string) {
  text.value = content
  speech.speak()
}
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

const startTalking = () => {
  recognition.start()
  recognition.onResult((value) => {
    console.log('value', value)
  })
}

const onSubmit = async () => {
  const key = getKey()
  if (!verifyKey(key)) return alert('请输入正确的API-KEY')

  if (!message.value) return
  chatMessages.value.push({
    content: message.value,
    role: 'user',
  })
  message.value = ''
  loading.value = true
  const res = await generateText(chatMessages.value, key!)
  if (res.error) {
    alert(res.error?.message)
    return loading.value = false
  }
  chatMessages.value.push({
    content: res.choices[0].message.content,
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
          <div mx-2>
            <p px-2 py-1 chat-box>
              {{ item.content }}
            </p>
            <p v-if="item.role === 'assistant'" flex>
              <span class="bg-gray-100/20  rounded-lg w-4 py-1 px-3 center" @click="play(item.content)">
                <i icon-btn rotate-90 i-ic:sharp-wifi />
              </span>
              <!-- <span
                class="bg-gray-100/20 ml-1 cursor-pointer rounded-lg w-4 py-1 px-3 center"
              >
                <i icon-btn i-carbon:ibm-watson-language-translator />
              </span> -->
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex h-10 w-[-webkit-fill-available] mt-1">
      <Button
        mr-1
        i-carbon:microphon
        @click="startTalking()"
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
