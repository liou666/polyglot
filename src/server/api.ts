import { sendAzureMessages, sendOpenAIMessages } from '@/utils'
import { supportLanguageMap } from '@/config'

export const generateText = async (messages: ChatMessage[], config: ChatConfig) => {
  switch (config.apiName) {
    case 'OpenAI': {
      const openAIAPIKey = config.apiKey
      const openAIAPIEndpoint = config?.apiEndpoint || 'https://api.openai.com'
      const opneAIAPIModel = config?.apiModel || 'gpt-3.5-turbo'
      const opneAIAPIMaxToken = config?.apiMaxToken || '2000'

      const openAIPayload: OpenAIChatPayload = {
        model: opneAIAPIModel as OpenAIModel,
        messages,
        max_tokens: +opneAIAPIMaxToken,
        stream: false,
      }
      return await sendOpenAIMessages(openAIPayload, openAIAPIKey, openAIAPIEndpoint)
    }

    case 'Azure': {
      const azureAPIKey = config.apiKey
      const azureAPIEndpoint = config?.apiEndpoint || ''
      const azureAPIModel = config.apiModel || 'gpt-3.5-turbo'
      const azureAPIMaxToken = config?.apiMaxToken || '2000'
      const azureAPIDeploymentName = config?.apiDeploymentName || ''
      const azurePayload: OpenAIChatPayload = {
        model: azureAPIModel,
        messages,
        max_tokens: +azureAPIMaxToken as number,
        stream: false,
      }
      return await sendAzureMessages(azurePayload, azureAPIKey, azureAPIEndpoint, azureAPIDeploymentName)
    }
  }
}

export const generatTranslate = async (text: string, config: ChatConfig) => {
  const system = 'You are a translation engine that can only translate text and cannot interpret it, ensuring that the translation is clear, concise, and coherent.'
  const assistantPrompt = `Please translate the following text into Chinese Simplified: ${text}`

  const messages = [
    { role: 'system', content: system },
    { role: 'user', content: assistantPrompt },
  ]
  const commonPayload: OpenAIChatPayload = {
    temperature: 0.2,
    n: 1,
    stream: false,
    messages,
    model: 'gpt-3.5-turbo-0301',
  }

  switch (config.apiName) {
    case 'OpenAI': {
      const openAIAPIKey = config.apiKey
      const openAIAPIEndpoint = config?.apiEndpoint || 'https://api.openai.com'
      return await sendOpenAIMessages(commonPayload, openAIAPIKey, openAIAPIEndpoint)
    }

    case 'Azure': {
      const azureAPIKey = config.apiKey
      const azureAPIEndpoint = config?.apiEndpoint || ''
      const azureAPIDeploymentName = config?.apiDeploymentName || ''
      return await sendAzureMessages(commonPayload, azureAPIKey, azureAPIEndpoint, azureAPIDeploymentName)
    }
  }
}

export const generatAnalysis = async (text: string, lang: string, config: ChatConfig) => {
  const system = `我是中国人，在练习${supportLanguageMap[lang]},我想让你扮演我的${supportLanguageMap[lang]}语法老师，你需要用中文来纠正我${supportLanguageMap[lang]}语法的错误，如果语法没有错误，则回复\'无语法错误\'，如果句子不完整，则回复\'句子不完整\'。记住你只需纠正我的语法错误，其他内容不需要回复，`
  const assistantPrompt = `'${text}'`
  const messages = [
    { role: 'system', content: system },
    { role: 'user', content: assistantPrompt },
  ]
  const commonPayload: OpenAIChatPayload = {
    temperature: 0.2,
    n: 1,
    stream: false,
    messages,
    model: 'gpt-3.5-turbo-0301',
  }
  switch (config.apiName) {
    case 'OpenAI': {
      const openAIAPIKey = config.apiKey
      const openAIAPIEndpoint = config?.apiEndpoint || 'https://api.openai.com'
      return await sendOpenAIMessages(commonPayload, openAIAPIKey, openAIAPIEndpoint)
    }

    case 'Azure': {
      const azureAPIKey = config.apiKey
      const azureAPIEndpoint = config?.apiEndpoint || ''
      const azureAPIDeploymentName = config?.apiDeploymentName || ''

      return await sendAzureMessages(commonPayload, azureAPIKey, azureAPIEndpoint, azureAPIDeploymentName)
    }
  }
}
