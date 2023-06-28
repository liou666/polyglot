interface MessageCommon {
  content: string
}

interface UserMessage extends MessageCommon {
  role: 'user'
}

interface AssistantMessage extends MessageCommon {
  role: 'assistant'
}

interface SystemMessage extends MessageCommon {
  role: 'system'
}

interface ChatMessage extends MessageCommon {
  role: UserMessage['role'] | AssistantMessage['role'] | SystemMessage['role']
}

interface RequestInitWithDispatcher extends RequestInit {
  dispatcher?: any
}

interface ImagePayload {
  prompt: string
  n?: number
  size?: string
}

interface ChatMessageWithAudioUrl extends ChatMessage {
  audioBlob?: string //base64
  isBlur?:  boolean
}
