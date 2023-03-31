import type { VoiceInfo } from 'microsoft-cognitiveservices-speech-sdk'
import {
  AudioConfig,
  SpeechConfig,
  SpeechRecognizer,
  SpeechSynthesizer,
} from 'microsoft-cognitiveservices-speech-sdk'

export const useSpeechService = (subscriptionKey: string, region: string) => {
  const language = ref('en-US')
  const voiceName = ref('en-US-GuyNeural')
  const speechConfig = SpeechConfig.fromSubscription(subscriptionKey, region)
  const isRecognizing = ref(false)

  const audioConfig = AudioConfig.fromDefaultMicrophoneInput()
  const recognizer = new SpeechRecognizer(speechConfig, audioConfig)
  const synthesizer = new SpeechSynthesizer(speechConfig)

  watch([language, voiceName], ([lang, voice]) => {
    speechConfig.speechRecognitionLanguage = lang
    speechConfig.speechSynthesisLanguage = lang
    speechConfig.speechSynthesisVoiceName = voice
  }, {
    immediate: true,
  })

  // 语音识别
  const startRecognizeSpeech = () => {
    isRecognizing.value = true
    recognizer.startContinuousRecognitionAsync()
  }

  // 停止语音识别
  const stopRecognizeSpeech = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      recognizer.recognized = (s, e) => {
        recognizer.stopContinuousRecognitionAsync()
        isRecognizing.value = false
        resolve(e.result.text)
      }
    })
  }

  // 识别一次，无需取消
  const recognizeSpeech = (): Promise<string> => {
    isRecognizing.value = true
    return new Promise((resolve, reject) => {
      recognizer.recognizeOnceAsync((result) => {
        if (result.text) {
          isRecognizing.value = false
          resolve(result.text)
        }
        else {
          isRecognizing.value = false
          reject(new Error('语音识别失败'),
          )
        }
      })
    })
  }

  // 语音合成
  const textToSpeak = async (text: string, voice?: string) => {
    speechConfig.speechSynthesisVoiceName = voice || speechConfig.speechSynthesisVoiceName
    synthesizer.speakTextAsync(text)
  }

  // 停止语音合成
  const stopTextToSpeak = () => {
    synthesizer.close()
  }

  // 获取语音列表
  const getVoices = async (): Promise<VoiceInfo[]> => {
    const res = await synthesizer.getVoicesAsync()
    return res.voices
  }

  return {
    language,
    voiceName,
    isRecognizing,
    startRecognizeSpeech,
    stopRecognizeSpeech,
    recognizeSpeech,
    textToSpeak,
    stopTextToSpeak,
    getVoices,
  }
}
