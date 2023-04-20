import type { VoiceInfo } from 'microsoft-cognitiveservices-speech-sdk'
import {
  AudioConfig,
  SpeakerAudioDestination,
  SpeechConfig,
  SpeechRecognizer,
  SpeechSynthesizer,
} from 'microsoft-cognitiveservices-speech-sdk'

export class SpeechService {
  private recognizer: SpeechRecognizer
  private synthesizer: SpeechSynthesizer
  private speechConfig: SpeechConfig
  public isRecognizing = false
  public isSpeaking = false

  constructor(subscriptionKey: string, region: string) {
    const speechConfig = SpeechConfig.fromSubscription(subscriptionKey, region)
    speechConfig.speechRecognitionLanguage = 'en-US'
    speechConfig.speechSynthesisLanguage = 'en-US'
    speechConfig.speechSynthesisVoiceName = 'en-US-GuyNeural'

    this.speechConfig = speechConfig

    const player = new SpeakerAudioDestination()

    player.onAudioStart = function (_) {
      window.console.log('playback started')
    }
    player.onAudioEnd = function (_) {
      window.console.log('playback finished')
    }

    const audioConfig = AudioConfig.fromDefaultMicrophoneInput()
    const audioConfiga = AudioConfig.fromSpeakerOutput(player)

    this.recognizer = new SpeechRecognizer(this.speechConfig, audioConfig)
    this.synthesizer = new SpeechSynthesizer(this.speechConfig, audioConfiga)
  }

  // 语音识别
  public startRecognizeSpeech() {
    this.isRecognizing = true
    this.recognizer.startContinuousRecognitionAsync()
  }

  // 停止语音识别
  public stopRecognizeSpeech(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.recognizer.recognized = (s, e) => {
        this.recognizer.stopContinuousRecognitionAsync()
        this.isRecognizing = false
        resolve(e.result.text)
      }
    })
  }

  // 识别一次，无需取消
  public recognizeSpeech(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.recognizer.recognizeOnceAsync((result) => {
        if (result.text)
          resolve(result.text)
        else
          reject(new Error('语音识别失败'))
      })
    })
  }

  // 语音合成
  public async textToSpeak(text: string, voice?: string) {
    // this.isSpeaking = true
    this.speechConfig.speechSynthesisVoiceName = voice || this.speechConfig.speechSynthesisVoiceName
    this.synthesizer.speakTextAsync(text, () => {
      this.synthesizer.close()
    })
  }

  // 停止语音合成
  public stopTextToSpeak() {
    this.synthesizer.close()
  }

  // 获取语音列表
  public async getVoices(): Promise<VoiceInfo[]> {
    const res = await this.synthesizer.getVoicesAsync()
    return res.voices
  }
}
