import type { VoiceInfo } from 'microsoft-cognitiveservices-speech-sdk'
import {
  AudioConfig,
  SpeechConfig,
  SpeechRecognizer,
  SpeechSynthesizer,
} from 'microsoft-cognitiveservices-speech-sdk'

export const useSpeechService = (subscriptionKey: string, region: string, langs = <const>['fr-FR', 'ja-JP', 'en-US', 'zh-CN', 'zh-HK', 'ko-KR', 'de-DE']) => {
  const languages = ref(langs)
  const language = ref<typeof langs[number]>(langs[0])
  const languageMap = ref<Partial<Record<typeof langs[number], VoiceInfo[]>>>({})
  const voiceName = ref('en-US-JennyMultilingualNeural')

  const speechConfig = ref(SpeechConfig.fromSubscription(subscriptionKey, region))
  const isRecognizing = ref(false) // 语音识别中
  const isSynthesizing = ref(false) // 语音合成中
  const allVoices = ref<VoiceInfo[]>([])

  const audioConfig = AudioConfig.fromDefaultMicrophoneInput()
  const recognizer = ref(new SpeechRecognizer(speechConfig.value, audioConfig))
  const synthesizer = ref(new SpeechSynthesizer(speechConfig.value))

  watch([language, voiceName], ([lang, voice]) => {
    speechConfig.value.speechRecognitionLanguage = lang
    speechConfig.value.speechSynthesisLanguage = lang
    speechConfig.value.speechSynthesisVoiceName = voice
    recognizer.value = new SpeechRecognizer(speechConfig.value, audioConfig)
    synthesizer.value = new SpeechSynthesizer(speechConfig.value)
  }, {
    immediate: true,
  })

  // 语音识别
  const startRecognizeSpeech = () => {
    isRecognizing.value = true
    recognizer.value.startContinuousRecognitionAsync()
  }

  // 停止语音识别
  const stopRecognizeSpeech = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      recognizer.value.recognized = (s, e) => {
        recognizer.value.stopContinuousRecognitionAsync()
        isRecognizing.value = false
        resolve(e.result.text)
      }
    })
  }

  // 识别一次，无需取消
  const recognizeSpeech = (): Promise<string> => {
    isRecognizing.value = true
    return new Promise((resolve, reject) => {
      recognizer.value.recognizeOnceAsync((result) => {
        if (result.text) {
          isRecognizing.value = false
          resolve(result.text)
        }
        else {
          isRecognizing.value = false
          reject(new Error(`未识别到任何内容-${language.value}`),
          )
        }
      }, (err) => {
        isRecognizing.value = false
        reject(err)
      })
    })
  }

  // 语音合成
  const textToSpeak = async (text: string, voice?: string) => {
    isSynthesizing.value = true
    speechConfig.value.speechSynthesisVoiceName = voice || speechConfig.value.speechSynthesisVoiceName
    synthesizer.value.speakTextAsync(text, (result) => {
      // if (result.errorDetails)
      //   console.error(`语音播放失败：${result.errorDetails}`)
      // else
      //   console.log('语音播放完成')
      isSynthesizing.value = false
    })
  }

  // 停止语音合成
  const stopTextToSpeak = () => {
    synthesizer.value.close()
  }

  // 获取语音列表
  const getVoices = async (): Promise<VoiceInfo[]> => {
    const res = await synthesizer.value.getVoicesAsync()
    return res.voices
  }

  onMounted(async () => {
    try {
      allVoices.value = await getVoices()
      // fr-FR 法语 ja-JP 日语 en-US 英语 zh-CN 中文 zh-HK 粤语 ko-KR 韩语 de-DE 德语
      for (const lang of languages.value)
        languageMap.value[lang] = allVoices.value.filter(x => lang === x.locale)
      console.log(languageMap)
    }
    catch (error) {
      allVoices.value = []
    }
  })

  return {
    languageMap,
    languages,
    language,
    voiceName,
    isRecognizing,
    startRecognizeSpeech,
    stopRecognizeSpeech,
    recognizeSpeech,
    textToSpeak,
    stopTextToSpeak,
    getVoices,
    allVoices,
    isSynthesizing,
  }
}
