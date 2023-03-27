export class Speaker {
  public utter: SpeechSynthesisUtterance
  public voices: SpeechSynthesisVoice[] = []

  constructor(option: { lang?: string; pitch?: number; rate?: number; volume?: number; text?: string }) {
    const {
      lang = 'zh-CN',
      pitch = 1,
      rate = 1,
      volume = 1,
      text = '',
    } = option
    this.utter = new window.SpeechSynthesisUtterance()
    this.utter.lang = lang
    this.utter.pitch = pitch
    this.utter.rate = rate
    this.utter.volume = volume
    this.utter.text = text
    this.getVoices()
  }

  getVoices() {
    window.speechSynthesis.onvoiceschanged = () => {
      this.voices = window.speechSynthesis.getVoices()
      if (this.voices.length > 0)
        this.utter.voice = this.voices[0] // 设置声音来源
    }
  }

  // 开始播放当前的语音
  start() {
    window.speechSynthesis.speak(this.utter)
  }

  // 暂停播放
  pause() {
    window.speechSynthesis.pause()
  }

  // 暂停之后继续播放
  resume() {
    window.speechSynthesis.resume()
  }

  // 清空所有播放
  cancel() {
    window.speechSynthesis.cancel()
  }

  // 切换语音的内容
  change(text: string) {
    this.utter.text = text
    window.speechSynthesis.speak(this.utter)
  }
}

export class Recognition {
  public recognition: any
  public isListening: boolean
  public result: string

  constructor(lang = 'zh-CN') {
    this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)()
    this.isListening = false
    this.result = ''
    this.recognition.lang = lang
  }

  // 开始语音识别
  start() {
    this.isListening = true
    this.recognition.start()
  }

  // 结束语音识别
  stop() {
    this.isListening = false
    this.recognition.stop()
  }

  // 监听语音识别的结果
  onResult(callback: (result: string) => void) {
    this.recognition.onresult = (e: any) => {
      const result = e.results[0][0].transcript
      this.result = result
      callback(result)
    }
  }
}

