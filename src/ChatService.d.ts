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
}

type ServiceProviderProps = 'Azure' | 'Claude' | 'OpenAI';

type OpenAIModel =
  'gpt-3.5-turbo' |
  'gpt-3.5-turbo-0301' 
  'gpt-4' |
  'gpt-4-0314' |
  'gpt-4-32k' |
  'gpt-4-32k-0314';
interface OpenAIChatPayload {
  model: OpenAIModel;
  messages: OpenAIMessage[];
  temperature?: number;
  top_p?: number;
  n?: integer;
  stream?: boolean;
  stop?: string | string[];
  max_tokens?: integer;
  presence_penalty?: number;
  frequency_penalty?: number;
  // logit_bias?: map;
  user?: string;
}

interface ChatConfig{
  apiKey: string
  apiEndpoint?: string
  apiModel: OpenAIModel
  apiTemperature?: string
  apiDeploymentName?: string
  apiMaxToken?: string
  apiRememberCount?: string
  apiName: ServiceProviderProps
}

