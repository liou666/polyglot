import { AZURE_KEY, AZURE_REGION, AZURE_TRANSLATE_KEY, CHAT_API_NAME, CHAT_REMEMBER_COUNT, OPEN_KEY, OPEN_MODEL, OPEN_PROXY, SELF_AVATAR_URL } from '@/constant'

import { getAvatarUrl } from '@/utils'

const defaultOpenKey = import.meta.env.VITE_OPENAI_API_KEY
const defaultOpenProxy = import.meta.env.VITE_SERVE_PROXY
const defaultAzureRegion = import.meta.env.VITE_REGION
const defaultAzureKey = import.meta.env.VITE_SCRIPTION_KEY
const defaultAzureTranslateKey = import.meta.env.VITE_TRANSLATE_KEY

export const useGlobalSetting = () => {
  const openKey = useLocalStorage(OPEN_KEY, defaultOpenKey)
  const openProxy = useLocalStorage(OPEN_PROXY, defaultOpenProxy)
  const azureRegion = useLocalStorage(AZURE_REGION, defaultAzureRegion)
  const azureKey = useLocalStorage(AZURE_KEY, defaultAzureKey)
  const azureTranslateKey = useLocalStorage(AZURE_TRANSLATE_KEY, defaultAzureTranslateKey)
  const openModel = useLocalStorage(OPEN_MODEL, 'gpt-3.5-turbo')
  const selfAvatar = useLocalStorage(SELF_AVATAR_URL, getAvatarUrl('self.png'))
  const chatApiName = useLocalStorage(CHAT_API_NAME, 'openai')
  const chatRememberCount = useLocalStorage(CHAT_REMEMBER_COUNT, '10')

  return {
    openKey,
    openProxy,
    openModel,
    azureRegion,
    azureKey,
    azureTranslateKey,
    selfAvatar,
    chatApiName,
    chatRememberCount,
  }
}

export default useGlobalSetting
