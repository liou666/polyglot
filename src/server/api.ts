import { OpenAi } from '@/utils'

export const generateText = async (messages: ChatMessage[], apiKey: string, proxy?: string) => {
  const openai = new OpenAi(apiKey, proxy)

  const { url, initOptions } = openai.generateTurboPayload({ messages })
  try {
    const response = await fetch(url, initOptions)
    const data = await response.json()
    return data
  }
  catch (error) {
    return `[Error] ${(error as any).message}. try again later or try using proxy`
  }
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
