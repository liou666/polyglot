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
