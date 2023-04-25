<script setup lang="ts">
import { v4 as uuid } from 'uuid'
import type { VoiceInfo } from 'microsoft-cognitiveservices-speech-sdk'
import Avatar from '@/components/Avatar.vue'

import { supportLanguageMap } from '@/config'
import { useConversationStore } from '@/stores'
import { getAvatarUrl } from '@/utils'
const { allVoices } = defineProps<{ allVoices: VoiceInfo[] }>()
const emits = defineEmits(['close'])
const modules = import.meta.glob(['../../../assets/avatars/*', '!../../../assets/avatars/self.png'])
const avatarList = ref<string[]>(Object.keys(modules).map(path => path.replace('../../../assets/avatars/', '')))
const currentAvatarIndex = ref(Math.random() * avatarList.value.length | 0)

const store = useConversationStore()
const { ssmlToSpeak, isSynthesizing, isPlaying } = useSpeechService({ isFetchAllVoice: false })
const allLanguages = computed(() => [...new Set(allVoices.map(v => v.locale))].filter(l => Object.keys(supportLanguageMap).includes(l)))
const selectLanguage = ref('')
const filterVoices = ref<VoiceInfo[]>([])
const selectVoiceName = ref('')
const desc = ref('')
const name = ref('')
const rate = ref('1.0')
const previewText = ref('hello wrold')

const canAdd = computed(() => !!(selectLanguage.value && selectVoiceName.value && desc.value && name.value))

onBeforeMount(() => {
  selectLanguage.value = allLanguages.value[0]
  changeSelectLanguage(selectLanguage.value)
})

watch(selectLanguage, changeSelectLanguage)

function changeSelectLanguage(newSelectLanguage: string) {
  filterVoices.value = allVoices.filter(v => v.locale === newSelectLanguage)
  selectVoiceName.value = filterVoices.value[0]?.shortName
}
const randomAvatar = getAvatarUrl(avatarList.value[Math.random() * avatarList.value.length | 0]) // 随机默认选择一个头像
const imageUrl = ref(randomAvatar)

const addChat = (event: any) => {
  event.preventDefault()
  const uid = uuid()
  store.addConversation({
    language: selectLanguage.value,
    voice: selectVoiceName.value,
    desc: desc.value,
    name: name.value,
    key: uid,
    avatar: imageUrl.value,
    rate: +rate.value,
    isDefault: false,
  })
  store.changeCurrentKey(uid)
  emits('close')
}

// 使用本地内置头像
const changeAvatar = () => {
  currentAvatarIndex.value = avatarList.value.length - 1 === currentAvatarIndex.value ? 0 : currentAvatarIndex.value + 1
}
const previewSpeech = () => {
  ssmlToSpeak(previewText.value, { voice: selectVoiceName.value, lang: selectLanguage.value, voiceRate: +rate.value })
}
</script>

<script>

</script>

<template>
  <div flex="~ col gap-3" items-center>
    <!-- <div text-lg font-bold>
      自定义对话
    </div> -->

    <div flex>
      <Avatar v-model:image-url="imageUrl" />
    </div>
    <div flex>
      <label for="">姓名</label>
      <input v-model="name" type="text">
    </div>
    <div flex>
      <label for="">备注</label>
      <input v-model="desc" type="text">
    </div>
    <div flex>
      <label for="">语言</label>
      <select v-model="selectLanguage">
        <option v-for="item in allLanguages" :key="item" :value="item">
          {{ supportLanguageMap[item] }}
        </option>
      </select>
    </div>
    <div flex>
      <label for="">音色</label>
      <select v-model="selectVoiceName">
        <option v-for="item in filterVoices" :key="item.shortName" :value="item.shortName">
          {{ `${item.locale} / ${item.gender === 1 ? 'Female' : 'Male'} / ${item.localName}` }}
        </option>
      </select>
    </div>
    <div relative center-y>
      <div flex>
        <label for="">语音预览</label>
        <input v-model="previewText" placeholder="输入文字预览语音" type="text">
      </div>
      <div absolute left-77>
        <button v-if="!isSynthesizing && !isPlaying " cursor-pointer :disabled="!previewText" center-y ml-2 @click="previewSpeech()">
          <i icon-btn rotate-90 i-ic:sharp-wifi />
        </button>
        <button v-else center-y ml-2>
          <i rotate-90 icon-btn i-svg-spinners:wifi-fade />
        </button>
      </div>
    </div>
    <div flex>
      <label for="">语速</label>
      <div w-55 flex>
        <input v-model="rate" flex-1 type="range" step="0.1" min="0.1" max="2.0">
        <span w-4 ml-1>{{ Number(rate).toFixed(1) }}</span>
      </div>
    </div>
    <!-- todo -->
    <!-- <div flex>
        <label center-y justify-end mr-2 for="">预设</label>
        <textarea id="message" resize-none w-50 block p-2 text-sm placeholder="Write your thoughts here..." />
      </div> -->
    <div center-y text-sm text-gray-500>
      <i inline-block w-4 h-4 m-1 cursor-auto i-ic:baseline-lightbulb />
      点击头像可更换头像
    </div>
    <button w-20 btn center p-2 mt2 :disabled="!canAdd" @click="addChat($event)">
      <i mr-1 i-ic:outline-add-circle />
      submit
    </button>
  </div>
</template>

<style scoped>
  label{
    @apply center-y justify-end mr-2 w-20
  }
  input{
    @apply w-50 p-2
  }
  select{
    @apply w-55 select-settings
  }
</style>
