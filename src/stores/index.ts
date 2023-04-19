import { v4 as uuid } from 'uuid'
import { generatePrompt, getAvatarUrl } from '@/utils'

const defaultConversations = [{
  key: uuid(),
  name: 'Jenny',
  desc: '美国',
  language: 'en-US',
  voice: 'en-US-JennyMultilingualNeural',
  avatar: getAvatarUrl('en.jpg'),
  rate: 1,
  chatMessages: [{
    role: 'system',
    content: generatePrompt('English'),
  },
  {
    role: 'user',
    content: generatePrompt('English'),
  },
  {
    role: 'assistant',
    content: 'hello world',
  }],
},
] as const

// export type Key = typeof defaultConversations[number]['key']
export type Key = string

export interface Conversation {
  key: Key // 名称 唯一标识
  name: string // 名称
  desc: string
  chatMessages: ChatMessage[] // 聊天信息
  language: string // tts stt
  voice: string // 参考 https://aka.ms/speech/tts-languages
  avatar: string // 用户头像
  rate: number // 语速
}

export interface State{
  conversations: Conversation[]
  currentKey: Conversation['key']
  loading: boolean
}

export const useConversationStore = defineStore('conversation', {
  state: (): State => {
    return {
      currentKey: defaultConversations[0].key,
      conversations: defaultConversations as unknown as Conversation[],
      loading: false,
    }
  },
  persist: true, // 临时方案，可能会出现存储空间不足，后续改成IndexDB存储
  getters: {
    chatMessages(state) {
      return (key: Key) => state.conversations.find(x => x.key === key)
    },
    allPeople(state) {
      return state.conversations.map(x => ({ key: x.key, desc: x.desc, avatar: x.avatar, name: x.name }))
    },
    allLanguage(state) {
      return state.conversations.map(x => (x.language))
    },
    getConversationsByCurrentProps(state) {
      return <T extends keyof Conversation>(props: T): Conversation[T] => state.conversations.find(x => x.key === state.currentKey)![props]
    },
  },
  actions: {
    changeConversations(chatMessages: ChatMessage[]) {
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
    addConversation(conversation: Omit<Conversation, 'chatMessages'>) {
      this.conversations.push({
        ...conversation,
        chatMessages: [{
          role: 'system',
          content: generatePrompt(conversation.language),
        }],
      })
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
