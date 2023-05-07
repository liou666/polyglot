import type { ParsedEvent, ReconnectInterval } from 'eventsource-parser'
import { createParser } from 'eventsource-parser'

export interface OpenAiPayload {
  url: string
  initOptions: RequestInit
}

export class OpenAi {
  private apiKey: string
  private proxy: string
  private header: Record<string, string>

  constructor(apiKey: string, proxy?: string) {
    this.apiKey = apiKey
    this.proxy = proxy || 'https://api.openai.com'
    this.header = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
    }
  }

  // gpt-3.5-turbo
  private getTurboUrl() {
    return `${this.proxy}/v1/chat/completions`
  }

  // common chat text-davinci-003
  private getChatUrl() {
    return `${this.proxy}/v1/chat/generations`
  }

  // image-ai
  private getImageUrl() {
    return `${this.proxy}/v1/images/generations`
  }

  // 账户余额信息
  private getDashboardUrl() {
    return `${this.proxy}/v1/dashboard/billing/credit_grants`
  }

  generateTurboPayload(body: Record<string, any> = {}): OpenAiPayload {
    return {
      url: this.getTurboUrl(),
      initOptions: {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        method: 'POST',
        body: JSON.stringify({ ...body, model: 'gpt-3.5-turbo' }),
      },
    }
  }

  generateChatPayload(body: Record<string, any> = {}): OpenAiPayload {
    return {
      url: this.getChatUrl(),
      initOptions: {
        headers: this.header,
        method: 'POST',
        body: JSON.stringify({
          ...body,
          model: 'text-davinci-003',
        }),
      },
    }
  }

  generateImagePayload(body: Record<string, any> = {}): OpenAiPayload {
    return {
      url: this.getImageUrl(),
      initOptions: {
        headers: this.header,
        method: 'POST',
        body: JSON.stringify({ ...body }),
      },
    }
  }

  generateDashboardPayload(): OpenAiPayload {
    return {
      url: this.getDashboardUrl(),
      initOptions: {
        method: 'GET',
        headers: this.header,
      },
    }
  }
}

export const parseOpenAIStream = (rawResponse: Response) => {
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  const stream = new ReadableStream({
    async start(controller) {
      const streamParser = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const data = event.data
          if (data === '[DONE]') {
            controller.close()
            return
          }
          try {
            const json = JSON.parse(data)
            const text = json.choices[0].delta?.content || ''
            const queue = encoder.encode(text)
            controller.enqueue(queue)
          }
          catch (e) {
            controller.error(e)
          }
        }
      }
      const parser = createParser(streamParser)
      for await (const chunk of rawResponse.body as any)
        parser.feed(decoder.decode(chunk))
    },
  })

  return stream
}

// 验证key api2d 41位，openai 51位
export const verifyOpenKey = (key?: string | null) => key && ([41, 51].includes(key.length))

export const generatePrompt = (language: string, name: string) => {
  return `I want you to act as an ${language} speaking partner and improver, your name is ${name}. No matter what language I speak to you, you need to reply me in ${language}. I hope you keep your responses clean and limit your responses to 80 characters. I hope you will ask me a question from time to time in your reply. Now let\'s start practicing. Remember, I want you reply me in ${language} and your name is ${name}.}`
}

export const basePrompt = (language: string, prompt?: string, name?: string) => {
  return `${prompt}. Remember, your name is ${name} , I want you reply me in ${language}, I hope limit your responses to 80 characters. Now let\'s start practicing. `
}
