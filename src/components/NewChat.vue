<script setup lang="ts">
import { v4 as uuid } from 'uuid'
import type { VoiceInfo } from 'microsoft-cognitiveservices-speech-sdk'
import { getAvatarUrl, getOpenAzureKey, getOpenAzureRegion } from '@/utils'
import { useConversationStore } from '@/stores'
const emits = defineEmits(['close'])
// const avatarPath = '../assets/avatars/'
const modules = import.meta.glob(['../assets/avatars/*', '!../assets/avatars/self.png'])
const avatarList = ref<string[]>(Object.keys(modules).map(path => path.replace('../assets/avatars/', '')))
const currentAvatarIndex = ref(Math.random() * avatarList.value.length | 0)

const { allVoices, isFetchAllVoices } = useSpeechService(getOpenAzureKey(), getOpenAzureRegion())

const store = useConversationStore()

const allLanguages = computed(() => [...new Set(allVoices.value.map(v => v.locale))])

const selectLanguage = ref('')
const filterVoices = ref<VoiceInfo[]>([])
const selectVoiceName = ref('')
const desc = ref('')
const name = ref('')

const canAdd = computed(() => !!(selectLanguage.value && selectVoiceName.value && desc.value && name.value))

watch([selectLanguage, allLanguages], ([newSelectLanguage]) => {
  filterVoices.value = allVoices.value.filter(v => v.locale === newSelectLanguage)
  selectVoiceName.value = filterVoices.value[0]?.shortName
})

watch(allLanguages, (newAllLanguages) => {
  selectLanguage.value = newAllLanguages[0]
})

const addChat = (event: any) => {
  event.preventDefault()
  store.addConversation({
    language: selectLanguage.value,
    voice: selectVoiceName.value,
    desc: desc.value,
    name: name.value,
    key: uuid(),
    avatar: getAvatarUrl(avatarList.value[currentAvatarIndex.value]),
  })
  emits('close')
}

const changeAvatar = () => {
  currentAvatarIndex.value = avatarList.value.length - 1 === currentAvatarIndex.value ? 0 : currentAvatarIndex.value + 1
}
</script>

<template>
  <div flex="~ col gap-3" items-center>
    <!-- <div text-lg font-bold>
      自定义对话
    </div> -->
    <div v-if="isFetchAllVoices" h-56 flex="~" items-center>
      <!-- <span>loading</span>  -->
      <i text-6 icon-btn i-eos-icons:three-dots-loading />
    </div>
    <template v-else>
      <div flex>
        <img w-14 h-14 rounded-full :src="getAvatarUrl(avatarList[currentAvatarIndex])" alt="" @click="changeAvatar()">
      </div>
      <div flex>
        <label center-y justify-end mr-2 for="">姓名</label>
        <input v-model="name" w-50 p-2 type="text">
      </div>
      <div flex>
        <label center-y justify-end mr-2 for="">备注</label>
        <input v-model="desc" w-50 p-2 type="text">
      </div>
      <div flex>
        <label center-y justify-end mr-2 for="">语言</label>
        <select v-model="selectLanguage" w-55 select-settings>
          <option v-for="item in allLanguages" :key="item" :value="item">
            {{ item }}
          </option>
        </select>
      </div>
      <div flex>
        <label center-y justify-end mr-2 for="">音色</label>
        <select v-model="selectVoiceName" w-55 select-settings>
          <option v-for="item in filterVoices" :key="item.shortName" :value="item.shortName">
            {{ `${item.locale} / ${item.gender === 1 ? 'Female' : 'Male'} / ${item.localName}` }}
          </option>
        </select>
      </div>
      <!-- <div center-y text-sm text-gray-500>
        <i inline-block w-4 h-4 m-1 cursor-auto i-ic:baseline-lightbulb />
        按 esc 键或点击空白处可关闭弹框
      </div> -->
      <div center-y text-sm text-gray-500>
        <i inline-block w-4 h-4 m-1 cursor-auto i-ic:baseline-lightbulb />
        点击头像可更换头像
      </div>
      <button w-20 btn center p-2 mt2 :disabled="!canAdd" @click="addChat($event)">
        <i mr-1 i-ic:outline-add-circle />
        submit
      </button>
    </template>
  </div>
</template>

