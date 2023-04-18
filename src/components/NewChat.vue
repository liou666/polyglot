<script setup lang="ts">
import { v4 as uuid } from 'uuid'
import type { VoiceInfo } from 'microsoft-cognitiveservices-speech-sdk'

import { supportLanguageMap } from '@/config'
import { useConversationStore } from '@/stores'
import { getAvatarUrl } from '@/utils'
const { allVoices } = defineProps<{ allVoices: VoiceInfo[] }>()
const emits = defineEmits(['close'])
const modules = import.meta.glob(['../assets/avatars/*', '!../assets/avatars/self.png'])
const avatarList = ref<string[]>(Object.keys(modules).map(path => path.replace('../assets/avatars/', '')))
const currentAvatarIndex = ref(Math.random() * avatarList.value.length | 0)
const inputFileElement = ref<HTMLInputElement | null>(null)

const store = useConversationStore()

const allLanguages = computed(() => [...new Set(allVoices.map(v => v.locale))].filter(l => Object.keys(supportLanguageMap).includes(l)))
const selectLanguage = ref('')
const filterVoices = ref<VoiceInfo[]>([])
const selectVoiceName = ref('')
const desc = ref('')
const name = ref('')
const rate = ref('1.0')

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
  })
  store.changeCurrentKey(uid)
  emits('close')
}

// 使用本地内置头像
const changeAvatar = () => {
  currentAvatarIndex.value = avatarList.value.length - 1 === currentAvatarIndex.value ? 0 : currentAvatarIndex.value + 1
}

const fileChange = (event: Event) => {
  const baseSize = 2

  const maxFileSize = baseSize * 1024 * 1024 // 2MB

  const file = (event.target as HTMLInputElement).files![0]
  const acceptImageType = ['image/png', 'image/jpeg']

  if (!file || !acceptImageType.includes(file.type)) {
    alert('仅支持上传png、jpg格式的图片')
    return
  }
  if (file.size > maxFileSize) {
    alert(`图片大小不能超过${baseSize}MB`)
    return
  }

  const reader = new FileReader()
  reader.onload = function () {
    imageUrl.value = reader.result as string
  }
  reader.readAsDataURL(file)
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
      <img object-fill w-14 h-14 rounded-full :src="imageUrl" alt="" @click="inputFileElement?.click()">
      <input ref="inputFileElement" type="file" name="avatar" class="hidden" accept=".jpg,.png" @change="fileChange($event)">
      <!-- <img w-14 h-14 rounded-full :src="getAvatarUrl(avatarList[currentAvatarIndex])" alt="" @click="changeAvatar()"> -->
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
          {{ supportLanguageMap[item] }}
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
    <div flex>
      <label center-y justify-end mr-2 for="">语速</label>
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
