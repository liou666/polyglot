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
