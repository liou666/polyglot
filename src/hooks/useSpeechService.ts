import type { VoiceInfo } from 'microsoft-cognitiveservices-speech-sdk'
import {
  AudioConfig,
  CancellationErrorCode,
  SpeakerAudioDestination,
  SpeechConfig,
  SpeechRecognizer,
  SpeechSynthesizer,
} from 'microsoft-cognitiveservices-speech-sdk'

const defaultAzureRegion = import.meta.env.VITE_REGION
const defaultAzureKey = import.meta.env.VITE_SCRIPTION_KEY
interface Config {
  langs?: readonly['fr-FR', 'ja-JP', 'en-US', 'zh-CN', 'zh-HK', 'ko-KR', 'de-DE']
  isFetchAllVoice?: boolean
}
export const useSpeechService = ({ langs = <const>['fr-FR', 'ja-JP', 'en-US', 'zh-CN', 'zh-HK', 'ko-KR', 'de-DE'], isFetchAllVoice = true }: Config = {}) => {
  const { azureKey, azureRegion } = useGlobalSetting()
  const languages = ref(langs)
  const language = ref<typeof langs[number]>(langs[0])
  const languageMap = ref<Partial<Record<typeof langs[number], VoiceInfo[]>>>({})
  const voiceName = ref('en-US-JennyMultilingualNeural')
  const speechConfig = ref(SpeechConfig.fromSubscription(azureKey.value || defaultAzureKey, azureRegion.value || defaultAzureRegion))
  const isRecognizing = ref(false) // 语音识别中
  const isSynthesizing = ref(false) // 语音合成中
  const isSynthesError = ref(false) // 语音失败
  const isRecognizReadying = ref(false) // 语音合成准备中
  const isPlaying = ref(false) // 语音播放中
  const isPlayend = ref(false) // 语音播放结束

  const isFetchAllVoices = ref(false) // 是否在请求所有语音列表
  const rate = ref(1) // 语速 (0,2]

  const allVoices = ref<VoiceInfo[]>([])

  const recognizer = ref<SpeechRecognizer>(new SpeechRecognizer(speechConfig.value))
  const synthesizer = ref<SpeechSynthesizer>(new SpeechSynthesizer(speechConfig.value))

  // 引入变量，触发 SpeechSynthesizer 实例的重新创建
  const count = ref(0)

  watch([language, voiceName, count, azureKey, azureRegion], ([lang, voice]) => {
    speechConfig.value = SpeechConfig.fromSubscription(azureKey.value || defaultAzureKey, azureRegion.value || defaultAzureRegion)
    speechConfig.value.speechRecognitionLanguage = lang
    speechConfig.value.speechSynthesisLanguage = lang
    speechConfig.value.speechSynthesisVoiceName = voice
    // 通过playback结束事件来判断播放结束
    const player = new SpeakerAudioDestination()
    player.onAudioStart = function (_) {
      if (isSynthesError.value) return
      isPlaying.value = true
      isPlayend.value = false
      console.log('playback started')
    }
    player.onAudioEnd = function (_) {
      console.log('playback finished')
      isPlaying.value = false
      isPlayend.value = true
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
    isRecognizReadying.value = true
    recognizer.value.canceled = (s, e) => {
      if (e.errorCode === CancellationErrorCode.AuthenticationFailure)
        console.error('Invalid or incorrect subscription key')
      else
        console.log(`Canceled: ${e.errorDetails}`)
      isRecognizReadying.value = false
      isRecognizing.value = false
    }
    recognizer.value.startContinuousRecognitionAsync(() => {
      isRecognizing.value = true
      isRecognizReadying.value = false
      console.log('Recognize...')
    },
    (error) => {
      isRecognizing.value = false
      console.error(`Error: ${error}`)
      recognizer.value.stopContinuousRecognitionAsync()
    })
  }

  // 停止语音识别
  const stopRecognizeSpeech = (cb?: (result: string) => unknown): Promise<void> => {
    recognizer.value.canceled = () => {
      console.log('Recognize canceled')
    }
    recognizer.value.recognized = (s, e) => {
      console.log('Recognize result: ', e.result.text)
      cb && cb(e.result.text)
    }
    return new Promise((resolve, reject) => {
      recognizer.value.stopContinuousRecognitionAsync(() => {
        console.log('Recognize End:')
        isRecognizing.value = false
        resolve()
      })
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

  const ssmlToSpeak = async (text: string, { voice, voiceRate, lang }: { voice?: string; voiceRate?: number; lang?: string } = {}) => {
    isSynthesizing.value = true
    isSynthesError.value = false
    const targetLang = lang || speechConfig.value.speechSynthesisLanguage
    const targetVoice = voice || speechConfig.value.speechSynthesisVoiceName
    const targetRate = voiceRate || rate.value

    const ssml = `
    <speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="${targetLang}">
      <voice name="${targetVoice}">
        <prosody rate="${targetRate}">
          ${text}
        </prosody>
      </voice>
    </speak>`
    synthesizer.value.SynthesisCanceled = (s, e) => {
      isSynthesError.value = true
      console.error('语音合成失败', e.result.errorDetails)
    }

    console.log('isSynthesizing')
    synthesizer.value.speakSsmlAsync(ssml, () => {
      console.log('isSynthesiz end')

      stopTextToSpeak()
    }, (err) => {
      console.error('播放失败', err)
      stopTextToSpeak()
    })
  }

  // 停止语音合成
  function stopTextToSpeak() {
    isSynthesizing.value = false
    synthesizer.value.close()
    count.value++ // 触发实例的重新创建
  }

  // 获取语音列表
  const getVoices = async (): Promise<VoiceInfo[]> => {
    const res = await synthesizer.value.getVoicesAsync()
    return res.voices
  }

  onMounted(async () => {
    if (isFetchAllVoice) {
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
    isRecognizReadying,
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
