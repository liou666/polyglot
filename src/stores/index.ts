import { v4 as uuid } from 'uuid'
import { basePrompt, generatePrompt, getAvatarUrl } from '@/utils'

const defaultConversations = [{
  key: uuid(),
  name: 'Jenny',
  desc: '美国',
  isDefault: true,
  language: 'en-US',
  voice: 'en-US-JennyMultilingualNeural',
  avatar: getAvatarUrl('en.jpg'),
  rate: 1,
  chatMessages: [{
    role: 'system',
    content: generatePrompt('English', 'Jenny'),
  }],
},
] as const

// export type Key = typeof defaultConversations[number]['key']
export type Key = string

export interface Conversation {
  key: Key // 名称 唯一标识
  name: string // 名称
  desc: string
  chatMessages: ChatMessageWithAudioUrl[] // 聊天信息
  language: string // tts stt
  voice: string // 参考 https://aka.ms/speech/tts-languages
  avatar: string // 用户头像
  rate: number // 语速
  voiceStyle: string // 情感
  isDefault?: boolean // 系统默认不允许删除
}

export interface State{
  conversations: Conversation[]
  currentKey: Conversation['key']
  loading: boolean
  isMainActive: boolean // 是否在主窗口聊天界面, 用于判断是否开启空格键语音识别
}

export const useConversationStore = defineStore('conversation', {
  state: (): State => {
    return {
      currentKey: defaultConversations[0].key,
      conversations: defaultConversations as unknown as Conversation[],
      loading: false,
      isMainActive: true,
    }
  },
  persist: {
    paths: ['currentKey', 'conversations'],
  }, // 临时方案，可能会出现存储空间不足，后续改成IndexDB存储
  getters: {
    chatMessages(state) {
      return (key: Key) => state.conversations.find(x => x.key === key)
    },
    allPeople(state) {
      return state.conversations.map(x => ({ key: x.key, desc: x.desc, avatar: x.avatar, name: x.name, isDefault: x.isDefault }))
    },
    allLanguage(state) {
      return state.conversations.map(x => (x.language))
    },
    getConversationsByCurrentProps(state) {
      return <T extends keyof Conversation>(props: T): Conversation[T] => state.conversations.find(x => x.key === state.currentKey)![props]
    },
  },
  actions: {
    changeConversations(chatMessages: ChatMessageWithAudioUrl[]) {
      this.chatMessages(this.currentKey)!.chatMessages = chatMessages
    },
    changeCurrentKey(key: Key) {
      this.currentKey = key
    },
    changeLoading(loading: boolean) {
      this.loading = loading
    },
    cleanCurrentConversations() {
      this.chatMessages(this.currentKey)!.chatMessages.length = 1
    },
    addConversation(conversation: Omit<Conversation, 'chatMessages'>, systemPrompt?: string) {
      this.conversations.push({
        ...conversation,
        chatMessages: [{
          role: 'system',
          content: systemPrompt ? basePrompt(conversation.language, systemPrompt, conversation.name) : generatePrompt(conversation.language, conversation.name),
        }],
      })
    },
    changeMainActive(isMainActive: boolean) {
      this.isMainActive = isMainActive
    },
    deleteConversation(key: Key) {
      if (this.conversations.length === 1)
        return alert('至少保留一个会话')

      this.conversations = this.conversations.filter(x => x.key !== key)

      if (this.currentKey === key)
        this.currentKey = this.conversations[0]?.key
    },
  },
})
