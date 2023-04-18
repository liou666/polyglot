import type { VoiceInfo } from 'microsoft-cognitiveservices-speech-sdk'
import {
  AudioConfig,
  ResultReason,
  SpeakerAudioDestination,
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
  const isPlaying = ref(false) // 语音播放中
  const isPlayend = ref(false) // 语音播放结束

  const isFetchAllVoices = ref(false) // 是否在请求所有语音列表
  const rate = ref(1) // 语速 (0,2]

  const allVoices = ref<VoiceInfo[]>([])

  const recognizer = ref<SpeechRecognizer>(new SpeechRecognizer(speechConfig.value))
  const synthesizer = ref<SpeechSynthesizer>(new SpeechSynthesizer(speechConfig.value))

  // 引入变量，触发 SpeechSynthesizer 实例的重新创建
  const count = ref(0)

  watch([language, voiceName, count], ([lang, voice]) => {
    speechConfig.value.speechRecognitionLanguage = lang
    speechConfig.value.speechSynthesisLanguage = lang
    speechConfig.value.speechSynthesisVoiceName = voice

    // 通过playback结束事件来判断播放结束
    const player = new SpeakerAudioDestination()
    player.onAudioStart = function (_) {
      isPlaying.value = true
      isPlayend.value = false
      console.log('playback started')
    }
    player.onAudioEnd = function (_) {
      isPlaying.value = false
      isPlayend.value = true
      console.log('playback finished')
    }
    const audioConfig = AudioConfig.fromDefaultMicrophoneInput()
    const audioConfiga = AudioConfig.fromSpeakerOutput(player)
    recognizer.value = new SpeechRecognizer(speechConfig.value, audioConfig)
    synthesizer.value = new SpeechSynthesizer(speechConfig.value, audioConfiga)
  }, {
    immediate: true,
  })

  // 语音识别
  const startRecognizeSpeech = () => {
    recognizer.value.startContinuousRecognitionAsync(() => {
      isRecognizing.value = true
      console.log('Recognize...')
    },
    (error) => {
      isRecognizing.value = false
      console.error(`Error: ${error}`)
      recognizer.value.stopContinuousRecognitionAsync()
    })
  }

  // 停止语音识别
  const stopRecognizeSpeech = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      recognizer.value.recognized = (s, e) => {
        console.log('Recognize End')
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
          console.log(result)
          isRecognizing.value = false
          reject(new Error(`未识别到任何内容-${language.value}`),
          )
        }
      }, (err) => {
        isRecognizing.value = false
        console.log('recognizeSpeech error', err)
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

  const ssmlToSpeak = async (text: string) => {
    isSynthesizing.value = true

    const lang = speechConfig.value.speechSynthesisLanguage
    const voice = speechConfig.value.speechSynthesisVoiceName

    const ssml = `
    <speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="${lang}">
      <voice name="${voice}">
        <prosody rate="${rate.value}">
          ${text}
        </prosody>
      </voice>
    </speak>`

    synthesizer.value.speakSsmlAsync(ssml, () => {
      isSynthesizing.value = false
      stopTextToSpeak()
    }, (err) => {
      isSynthesizing.value = false
      console.error(err)
      stopTextToSpeak()
    })
  }

  // 停止语音合成
  function stopTextToSpeak() {
    synthesizer.value.close()
    count.value++ // 触发实例的重新创建
  }

  // 获取语音列表
  const getVoices = async (): Promise<VoiceInfo[]> => {
    const res = await synthesizer.value.getVoicesAsync()
    return res.voices
  }

  onMounted(async () => {
    try {
      isFetchAllVoices.value = true
      allVoices.value = await getVoices()
      // fr-FR 法语 ja-JP 日语 en-US 英语 zh-CN 中文 zh-HK 粤语 ko-KR 韩语 de-DE 德语
      for (const lang of languages.value)
        languageMap.value[lang] = allVoices.value.filter(x => lang === x.locale)
      console.log(languageMap)
      isFetchAllVoices.value = false
    }
    catch (error) {
      isFetchAllVoices.value = false
      allVoices.value = []
    }
  })

  return {
    languageMap,
    languages,
    language,
    voiceName,
    isRecognizing,
    isPlaying,
    isPlayend,
    startRecognizeSpeech,
    stopRecognizeSpeech,
    recognizeSpeech,
    textToSpeak,
    ssmlToSpeak,
    stopTextToSpeak,
    getVoices,
    allVoices,
    isSynthesizing,
    isFetchAllVoices,
    rate,
  }
}
