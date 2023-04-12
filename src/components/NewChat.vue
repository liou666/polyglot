<script setup lang="ts">
import { v4 as uuid } from 'uuid'
import type { VoiceInfo } from 'microsoft-cognitiveservices-speech-sdk'
import { getOpenAzureKey, getOpenAzureRegion } from '@/utils'
import { useConversationStore } from '@/stores'

defineEmits(['close'])

const { allVoices } = useSpeechService(getOpenAzureKey(), getOpenAzureRegion())

const store = useConversationStore()

const allLanguages = computed(() => [...new Set(allVoices.value.map(v => v.locale))])

const selectLanguage = ref('en-US')
const filterVoices = ref<VoiceInfo[]>([])
const selectVoiceName = ref('')
const desc = ref('')
const name = ref('')

const canAdd = computed(() => !!(selectLanguage.value && selectVoiceName.value && desc.value && name.value))

watch(selectLanguage, (selectLanguage) => {
  filterVoices.value = allVoices.value.filter(v => v.locale === selectLanguage)
  selectVoiceName.value = filterVoices.value[0]?.shortName
})

const addChat = () => {
  store.addConversation({
    language: selectLanguage.value,
    voice: selectVoiceName.value,
    desc: desc.value,
    name: name.value,
    key: uuid(),
    avatar: 'https://img.zcool.cn/community/01d6b85e0af4dba80120a8952ffd35.jpg@1280w_1l_2o_100sh.jpg',
  })
  close()
}
</script>

<template>
  <div flex="~ col gap-3">
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
    <button w-20 text-center btn p-3 mt2 :disabled="!canAdd" @click="addChat()">
      <i v-if="true" mr-1 i-ic:outline-add-circle />
      <i v-else mr-1 i-eos-icons:bubble-loading />
      ok
    </button>
  </div>
</template>

