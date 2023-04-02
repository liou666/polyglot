export const getAvatarUrl = (filename: string) => {
  return new URL(`../assets/avatars/${filename}`, import.meta.url).href
}
