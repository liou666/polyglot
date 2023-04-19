import type { Table } from 'dexie'
import Dexie from 'dexie'

export interface Friend {
  id?: number
  name: string
  age: number
}
export interface Conversation {
  id?: number
  key: string // 名称 唯一标识
  name: string // 名称
  desc: string
  chatMessages: ChatMessage[] // 聊天信息
  language: string // tts stt
  voice: string // 参考 https://aka.ms/speech/tts-languages
  avatar: string // 用户头像
  rate: number // 语速
}
export class MySubClassedDexie extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  friends!: Table<any>

  constructor() {
    super('pinaStore')
    this.version(1).stores({
      friends: '++id, key, value', // Primary key and indexed props
    })
  }
}

// 创建一个dexie实例
const db = new Dexie('myDatabase')

// 定义表结构
db.version(1).stores({
  pinaStore: '++id,key,value',
})

export { db }
