import { OpenAi } from '@/utils'
const apiKey = import.meta.env.VITE_OPENAI_API_KEY
const proxy = import.meta.env.VITE_SERVE_PROXY

const openai = new OpenAi(apiKey, proxy)

export const generateText = async (messages: ChatMessage[]) => {
  const { url, initOptions } = openai.generateTurboPayload({ messages })
  const response = await fetch(url, initOptions)
  const data = await response.json()
  return data.choices[0].message.content
}

export const generateDashboardInfo = async () => {
  const { url, initOptions } = openai.generateDashboardPayload()
  const response = await fetch(url, initOptions)
  const data = await response.json()
  return data
}
