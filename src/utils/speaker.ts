import type { VoiceInfo } from 'microsoft-cognitiveservices-speech-sdk'
import {
  AudioConfig,
  SpeechConfig,
  SpeechRecognizer,
  SpeechSynthesizer,
} from 'microsoft-cognitiveservices-speech-sdk'

export class SpeechService {
  private recognizer: SpeechRecognizer
  private synthesizer: SpeechSynthesizer
  private speechConfig: SpeechConfig
  constructor(subscriptionKey: string, region: string) {
    const speechConfig = SpeechConfig.fromSubscription(subscriptionKey, region)
    speechConfig.speechRecognitionLanguage = 'en-US'
    speechConfig.speechSynthesisLanguage = 'en-US'
    speechConfig.speechSynthesisVoiceName = 'en-US-GuyNeural'

    this.speechConfig = speechConfig

    const audioConfig = AudioConfig.fromDefaultMicrophoneInput()
    this.recognizer = new SpeechRecognizer(this.speechConfig, audioConfig)
    this.synthesizer = new SpeechSynthesizer(this.speechConfig)
  }

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

  public textToSpeak(text: string, voice?: string) {
    this.speechConfig.speechSynthesisVoiceName = voice || this.speechConfig.speechSynthesisVoiceName
    this.synthesizer.speakTextAsync(text)
  }

  public async getVoices(): Promise<VoiceInfo[]> {
    const res = await this.synthesizer.getVoicesAsync()
    return res.voices
  }
}
