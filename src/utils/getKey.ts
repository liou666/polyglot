import { AZURE_KEY, AZURE_REGION, OPEN_KEY, OPEN_PROXY } from '@/constant'

const defaultOpenKey = import.meta.env.VITE_OPENAI_API_KEY
const defaultOpenProxy = import.meta.env.VITE_SERVE_PROXY
const defaultAzureRegion = import.meta.env.VITE_REGION
const defaultAzureKey = import.meta.env.VITE_SCRIPTION_KEY

export const getOpenKey = () => {
  return localStorage.getItem(OPEN_KEY) || defaultOpenKey
}

export const getOpenProxy = () => {
  return localStorage.getItem(OPEN_PROXY) || defaultOpenProxy
}

export const getOpenAzureRegion = () => {
  return localStorage.getItem(AZURE_REGION) || defaultAzureRegion
}

export const getOpenAzureKey = () => {
  return localStorage.getItem(AZURE_KEY) || defaultAzureKey
}
