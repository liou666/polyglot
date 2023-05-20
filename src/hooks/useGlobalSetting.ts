import { AUTO_PLAY, AZURE_KEY, AZURE_REGION, AZURE_TRANSLATE_KEY, CHAT_API_NAME, CHAT_CONFIG, CHAT_REMEMBER_COUNT, IS_ALWAYS_RECOGNITION, OPEN_KEY, OPEN_MAX_TOKEN, OPEN_MODEL, OPEN_PROXY, SELF_AVATAR_URL, TTS_PASSWORD, VOICE_API_NAME } from '@/constant'

import { getAvatarUrl } from '@/utils'

export interface ChatOther {
  selfAvatarUrl: string
}

export const useGlobalSetting = () => {
  const azureRegion = useLocalStorage(AZURE_REGION, 'eastasia')
  const azureKey = useLocalStorage(AZURE_KEY, '')
  const voiceApiName = useLocalStorage(VOICE_API_NAME, 'Azure')
  const isAlwaysRecognition = useLocalStorage(IS_ALWAYS_RECOGNITION, false)
  const ttsPassword = useLocalStorage(TTS_PASSWORD, '')
  const autoPlay = useLocalStorage(AUTO_PLAY, true)

  const chatConfigRef = ref<ChatConfig & ChatOther>({
    apiKey: '',
    apiEndpoint: '',
    apiModel: 'gpt-3.5-turbo',
    apiTemperature: '0.3',
    apiDeploymentName: '',
    apiMaxToken: '2000',
    apiRememberCount: '10',
    apiName: 'OpenAI',
    selfAvatarUrl: getAvatarUrl('self.png'),
  })

  const chatConfig = useLocalStorage(CHAT_CONFIG, chatConfigRef.value)

  return {
    azureRegion,
    azureKey,
    voiceApiName,
    isAlwaysRecognition,
    ttsPassword,
    autoPlay,
    chatConfig,
  }
}

export default useGlobalSetting
