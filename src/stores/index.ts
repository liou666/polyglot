const defaultConversations = [{
  key: 'Tom',
  desc: 'as a teacher',
  chatMessages: [],
}, {
  key: 'Jarry',
  desc: 'as a classrooms',
  chatMessages: [],
}, {
  key: 'Lilei',
  desc: 'as a basketball paly',
  chatMessages: [],
}] as const

export type Key = typeof defaultConversations[number]['key']

export interface Conversation {
  key: Key
  desc: string
  chatMessages: ChatMessage[]
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
