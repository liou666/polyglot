import { v4 as uuid } from 'uuid'
import { OpenAi, fetchWithTimeout } from '@/utils'

export const generateText = async (messages: ChatMessage[], apiKey: string, proxy?: string) => {
  const openai = new OpenAi(apiKey, proxy)

  const { url, initOptions } = openai.generateTurboPayload({ messages })
  const response = await fetchWithTimeout(url, 10000, initOptions)
  const data = await response.json()
  return data
}

export const generateDashboardInfo = async (apiKey: string, proxy?: string) => {
  const openai = new OpenAi(apiKey, proxy)

  const { url, initOptions } = openai.generateDashboardPayload()
  try {
    const response = await fetch(url, initOptions)
    const data = await response.json()
    return data
  }
  catch (error) {
    return `[Error] ${(error as any).message}. try again later or try using proxy`
  }
}

export const generatTranslate = async ({ text, toLanguage = 'zh-Hans', translateKey }: { text: string; toLanguage: string; translateKey: string }) => {
  const endpoint = 'https://api.cognitive.microsofttranslator.com'

  const url = `${endpoint}/translate?api-version=3.0&to=${toLanguage}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': translateKey,
      'Ocp-Apim-Subscription-Region': 'eastus',
      'Content-Type': 'application/json',
      'X-ClientTraceId': uuid().toString(),
    },
    body: JSON.stringify([{ Text: text }]),
  })
  const result = await response.json()
  // return result
  return result[0].translations[0].text as string
}

