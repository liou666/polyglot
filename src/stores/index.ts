const defaultConversations = [{
  key: 'Jenny',
  desc: '美国',
  language: 'en-US',
  voice: 'en-US-JennyMultilingualNeural',
  chatMessages: [],
}, {
  key: '碧衣',
  desc: '日本',
  language: 'ja-JP',
  voice: 'ja-JP-AoiNeural',
  chatMessages: [],
}, {
  key: '선히',
  desc: '韩国',
  language: 'ko-KR',
  voice: 'ko-KR-SunHiNeural',
  chatMessages: [],
}] as const

export type Key = typeof defaultConversations[number]['key']

export interface Conversation {
  key: Key
  desc: string
  chatMessages: ChatMessage[]
  language: string
  voice: string
}

export interface State{
  conversations: Conversation[]
  currentKey: Conversation['key']
}

export const useConversationStore = defineStore('conversation', {
  state: (): State => {
    return {
      currentKey: defaultConversations[0].key,
      conversations: defaultConversations as unknown as Conversation[],
    }
  },
  getters: {
    chatMessages(state) {
      return (key: Key) => state.conversations.find(x => x.key === key)
    },
    allPeople(state) {
      return state.conversations.map(x => ({ key: x.key, desc: x.desc }))
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
  },
  actions: {
    changeConversations(chatMessages: ChatMessage[]) {
      this.chatMessages(this.currentKey)!.chatMessages = chatMessages
    },
    changeCurrentKey(key: Key) {
      this.currentKey = key
    },
  },
})
