import Api2d from 'api2d'
import { OpenAi } from '@/utils'
import useGlobalSetting from '@/hooks/useGlobalSetting'

const { openProxy, openModel, openKey, openMaxTokens } = useGlobalSetting()

const timeout = 1000 * 25 // 25s

export const generateText = async (messages: ChatMessage[]) => {
  const api = new Api2d(openKey.value, openProxy.value)

  // timeout临时方案 https://github.com/easychen/api2d-js/pull/4
  const timer = setTimeout(() => {
    api.abort()
    clearTimeout(timer)
  }, timeout)
  const completion = await api.completion({
    model: openModel.value,
    messages,
    stream: false,
    max_tokens: +openMaxTokens.value,
  })
  clearTimeout(timer)
  return completion
}

// 获取openapi余额接口已失效
// export const generateDashboardInfo = async (apiKey: string, proxy?: string) => {
//   const openai = new OpenAi(apiKey, proxy)

//   const { url, initOptions } = openai.generateDashboardPayload()
//   try {
//     const response = await fetch(url, initOptions)
//     const data = await response.json()
//     return data
//   }
//   catch (error) {
//     return `[Error] ${(error as any).message}. try again later or try using proxy`
//   }
// }

export const generatTranslate = async (text: string) => {
  const api = new Api2d(openKey.value, openProxy.value)
  const timer = setTimeout(() => {
    api.abort()
    clearTimeout(timer)
    throw new Error('timeout')
  }, timeout)

  const system = 'You are a translation engine that can only translate text and cannot interpret it, ensuring that the translation is clear, concise, and coherent.'
  const assistantPrompt = `Please translate the following text into Chinese Simplified: ${text}`
  const completion = await api.completion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: assistantPrompt },
    ],
    temperature: 1,
    n: 1,
    stream: false,
  })
  console.log(completion)
  clearTimeout(timer)
  return completion as any
}

export const generatAnalysis = async (text: string) => {
  const api = new Api2d(openKey.value, openProxy.value)
  const timer = setTimeout(() => {
    api.abort()
    clearTimeout(timer)
    throw new Error('timeout')
  }, timeout)

  const system = '我想让gpt扮演我的语法老师，不论我说什么语言你都需要用中文纠正我语法的错误，如果语法没有错误，则回复\'无语法错误\''
  const assistantPrompt = `'${text}'`
  const completion = await api.completion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: assistantPrompt },
    ],
    temperature: 1,
    n: 1,
    stream: false,
  })
  console.log(completion)
  clearTimeout(timer)
  return completion as any
}
