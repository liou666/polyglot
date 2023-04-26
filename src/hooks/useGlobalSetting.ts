import { AUTO_PLAY, AZURE_KEY, AZURE_REGION, AZURE_TRANSLATE_KEY, CHAT_API_NAME, CHAT_REMEMBER_COUNT, IS_ALWAYS_RECOGNITION, OPEN_KEY, OPEN_MAX_TOKEN, OPEN_MODEL, OPEN_PROXY, SELF_AVATAR_URL, TTS_PASSWORD, VOICE_API_NAME } from '@/constant'

import { getAvatarUrl } from '@/utils'

export const useGlobalSetting = () => {
  const openKey = useLocalStorage(OPEN_KEY, '')
  const openProxy = useLocalStorage(OPEN_PROXY, '')
  const azureRegion = useLocalStorage(AZURE_REGION, 'eastasia')
  const azureKey = useLocalStorage(AZURE_KEY, '')
  const openModel = useLocalStorage(OPEN_MODEL, 'gpt-3.5-turbo')
  const selfAvatar = useLocalStorage(SELF_AVATAR_URL, getAvatarUrl('self.png'))
  const chatApiName = useLocalStorage(CHAT_API_NAME, 'openAI')
  const chatRememberCount = useLocalStorage(CHAT_REMEMBER_COUNT, '10')
  const openMaxTokens = useLocalStorage(OPEN_MAX_TOKEN, '2000')

  const voiceApiName = useLocalStorage(VOICE_API_NAME, 'Azure')
  const isAlwaysRecognition = useLocalStorage(IS_ALWAYS_RECOGNITION, false)
  const ttsPassword = useLocalStorage(TTS_PASSWORD, '')
  const autoPlay = useLocalStorage(AUTO_PLAY, true)

  return {
    openKey,
    openProxy,
    openModel,
    azureRegion,
    azureKey,
    selfAvatar,
    chatApiName,
    chatRememberCount,
    openMaxTokens,
    voiceApiName,
    isAlwaysRecognition,
    ttsPassword,
    autoPlay,
  }
}

export default useGlobalSetting
