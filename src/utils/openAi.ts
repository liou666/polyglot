import { fetchWithTimeout } from './tools'

// 验证key api2d 41位，openai 51位
export const verifyOpenKey = (key?: string | null) => key && ([41, 51].includes(key.length))

export const generatePrompt = (language: string, name: string) => {
  return `I want you to act as an ${language} speaking partner and improver, your name is ${name}. No matter what language I speak to you, you need to reply me in ${language}. I hope you keep your responses clean and limit your responses to 80 characters. I hope you will ask me a question from time to time in your reply. Now let\'s start practicing. Remember, I want you reply me in ${language} and your name is ${name}.}`
}

export const basePrompt = (language: string, prompt?: string, name?: string) => {
  return `${prompt}. Remember, your name is ${name} , I want you reply me in ${language}, I hope limit your responses to 80 characters. Now let\'s start practicing. `
}

const timeout = 1000 * 25 // 25s

export async function sendAzureMessages(payload: OpenAIChatPayload, apiKey: string, apiEndpoint: string, deploymentName: string) {
  if (!apiKey)
    throw new Error('ERROR: No API key provided')

  if (!apiEndpoint)
    throw new Error('ERROR: No API endpoint provided')

  if (!deploymentName)
    throw new Error('ERROR: No deployment name provided')

  const res = await fetchWithTimeout(`${apiEndpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=2023-03-15-preview`, timeout, {
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    method: 'POST',
    body: JSON.stringify(payload),
  })

  const data = await res.json()

  if (data.error)
    throw new Error(`ERROR: ${data.error?.message || data.error?.code || data.error?.type}`)

  return data
}

export async function sendOpenAIMessages(payload: OpenAIChatPayload, apiKey: string, apiEndpoint: string) {
  if (!apiKey)
    throw new Error('ERROR: No API key provided')

  const API_KEY = apiKey
  const API_ENDPOINT = apiEndpoint || 'https://api.openai.com'

  const res = await fetchWithTimeout(`${API_ENDPOINT}/v1/chat/completions`, timeout, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    method: 'POST',
    body: JSON.stringify(payload),
  })

  const data = await res.json()

  if (data.error)
    throw new Error(`ERROR: ${data.error?.message || data.error?.code || data.error?.type}`)

  return data
}
