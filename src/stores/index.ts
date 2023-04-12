import { v4 as uuid } from 'uuid'
import { generatePrompt, getAvatarUrl } from '@/utils'

const defaultConversations = [{
  key: uuid(),
  name: 'Jenny',
  desc: '美国',
  language: 'en-US',
  voice: 'en-US-JennyMultilingualNeural',
  avatar: getAvatarUrl('en.jpg'),
  chatMessages: [{
    role: 'system',
    content: generatePrompt('English'),
  }],
}, {
  key: uuid(),
  name: '碧衣',
  desc: '日本',
  avatar: getAvatarUrl('jp1.webp'),
  language: 'ja-JP',
  voice: 'ja-JP-AoiNeural',
  chatMessages: [{
    role: 'system',
    content: generatePrompt('Japanese'),
  }],
}, {
  key: uuid(),
  name: '선히',
  desc: '韩国',
  avatar: getAvatarUrl('ko1.jpeg'),
  language: 'ko-KR',
  voice: 'ko-KR-SunHiNeural',
  chatMessages: [{
    role: 'system',
    content: generatePrompt('Korean'),
  }],
},
{
  key: uuid(),
  name: 'Brigitte',
  desc: '法国',
  avatar: getAvatarUrl('fr.webp'),
  language: 'fr-FR',
  voice: 'fr-FR-BrigitteNeural',
  chatMessages: [{
    role: 'system',
    content: generatePrompt('French'),
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
    currentChatMessages(state) {
      return state.conversations.find(x => x.key === state.currentKey)!.chatMessages
    },
    currentVoice(state) {
      return state.conversations.find(x => x.key === state.currentKey)!.voice
    },
    currentLanguage(state) {
      return state.conversations.find(x => x.key === state.currentKey)!.language
    },
    currentAvatar(state) {
      return state.conversations.find(x => x.key === state.currentKey)!.avatar
    },
    currentName(state) {
      return state.conversations.find(x => x.key === state.currentKey)!.name
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
    cleanConversations() {
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
  },
})
