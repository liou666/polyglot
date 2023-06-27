import childProcess from 'child_process'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const once = require('one-time')

export const getAvatarUrl = (filename: string) => {
  return new URL(`../assets/avatars/${filename}`, import.meta.url).href
}
export async function fetchWithTimeout(
  url: string,
  timeout: number,
  options: RequestInit = {},
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    controller.abort()
    // throw new Error(`网络请求 ${url} 已超时`)
  }, timeout)

  const { method = 'GET', headers = {}, body } = options

  const response = await fetch(url, {
    method,
    headers,
    body,
    signal: controller.signal,
  })

  clearTimeout(timeoutId)

  return response
}

export function blobToBase64(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    if (blob.size === 0)
      return resolve('')

    reader.readAsDataURL(blob)
    reader.onload = function () {
      const dataUrl = reader.result
      resolve(dataUrl!.toString())
    }
    reader.onerror = reject
  })
}

export function base64ToBlob(dataUrl: string) {
  const arr = dataUrl.split(',')
  const mime = arr[0].match(/:(.*?);/)![1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--)
    u8arr[n] = bstr.charCodeAt(n)
  return new Blob([u8arr], { type: mime })
}

export function getInstalledVoices(callback = (voices: string[][]) => {}) {
  if (typeof callback !== 'function')
    callback = () => {}
  callback = once(callback)
  let child = null
  const args = [
    'Add-Type -AssemblyName System.speech;$speak = New-Object System.Speech.Synthesis.SpeechSynthesizer;$speak.GetInstalledVoices() | %   {$_.VoiceInfo.Culture.displayName , $_.VoiceInfo.Culture.Name, $_.VoiceInfo.Gender,$_.VoiceInfo.Age,$_.VoiceInfo.Name}',
  ]
  let outputs = ''
  let voices: string[] = []
  let splitVoices: string[][] = []
  child = childProcess.spawn('powershell', args)
  child.stdout.on('data', (data) => {
    outputs += data
  })
  child.addListener('exit', (code, signal) => {
    if (outputs.length > 0) {
      voices = outputs.split('\r\n')
      voices = (voices[voices.length - 1] === '') ? voices.slice(0, voices.length - 1) : voices
      splitVoices = Array.from({ length: Math.ceil(voices.length / 5) }, (value, index) =>
        voices.slice(index * 5, index * 5 + 5),
      )
    }
    child = null
    callback(splitVoices)
  })

  child.stdin.end()
}

export function getMacInstalledVoices(callback = (voices: string[][]) => {}) {
  if (typeof callback !== 'function')
    callback = () => {}
  callback = once(callback)
  let child = null
  const args = [
    '--v=?',
  ]
  let outputs = ''
  let voices: string[] = []
  const splitVoices: string[][] = []

  child = childProcess.spawn('say', args)
  child.stdout.on('data', (data) => {
    outputs += data
  })
  child.addListener('exit', (code, signal) => {
    if (outputs.length > 0) {
      const temp = []
      voices = outputs.split('\n')
      voices = (voices[voices.length - 1] === '') ? voices.slice(0, voices.length - 1) : voices

      voices.forEach((voice) => {
        const prefix = voice.split('#')[0].trim()
        const desc = voice.split('#')[1].trim()
        const temp = prefix.split(' ')
        const name = temp[0]
        const lang = temp[temp.length - 1].replace('_', '-')

        splitVoices.push([
          lang,
          lang,
          'Unknown',
          'Unknown',
          name,
        ])
      })
    }

    child = null
    callback(splitVoices)
  })

  child.stdin.end()
}
