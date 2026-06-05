import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class VoiceService {
  private readonly voicePhrases: Record<string, string> = {
    // English
    'pay for my order': 'intent:CHECKOUT',
    'talk to human': 'intent:ESCALATE',
    'recommend products': 'intent:RECOMMEND',
    'search headphones': 'intent:SEARCH_PRODUCT',
    'track my order': 'intent:TRACK_ORDER',
    // Hindi
    'मेरे ऑर्डर का भुगतान करें': 'intent:CHECKOUT',
    'इंसान से बात करो': 'intent:ESCALATE',
    'उत्पादों की सिफारिश करें': 'intent:RECOMMEND',
    'हेडफ़ोन खोजें': 'intent:SEARCH_PRODUCT',
    // Telugu
    'నా ఆర్డర్ కోసం చెల్లించండి': 'intent:CHECKOUT',
    'మనిషితో మాట్లాడండి': 'intent:ESCALATE',
    'ఉత్పత్తులను సిఫార్సు చేయండి': 'intent:RECOMMEND',
    // Tamil
    'எனது ஆர்டருக்கு பணம் செலுத்துங்கள்': 'intent:CHECKOUT',
    'மனிதனுடன் பேசுங்கள்': 'intent:ESCALATE',
    'தயாரிப்புகளை பரிந்துரைக்கவும்': 'intent:RECOMMEND',
    // Kannada
    'ನನ್ನ ಆರ್ಡರ್‌ಗೆ ಪಾವತಿಸಿ': 'intent:CHECKOUT',
    'ಮಾನವನೊಂದಿಗೆ ಮಾತನಾಡಿ': 'intent:ESCALATE',
    'ಉತ್ಪನ್ನಗಳನ್ನು ಶಿಫಾರಸು ಮಾಡಿ': 'intent:RECOMMEND',
  };

  async speechToText(
    audioBase64: string,
    language: 'en' | 'hi' | 'te' | 'ta' | 'kn',
  ): Promise<{ text: string; intent?: string }> {
    if (!audioBase64) throw new BadRequestException('Audio data is required');

    // Simulate STT decoding: map to a realistic command based on base64 content hints or fallback
    let decodedText = 'search headphones';
    if (language === 'hi') decodedText = 'मेरे ऑर्डर का भुगतान करें';
    if (language === 'te') decodedText = 'నా ఆర్డర్ కోసం చెల్లించండి';
    if (language === 'ta') decodedText = 'மனிதனுடன் பேசுங்கள்';
    if (language === 'kn') decodedText = 'ಉತ್ಪನ್ನಗಳನ್ನು ಶಿಫಾರಸು ಮಾಡಿ';

    // Check base64 signature for specific mock phrases
    if (audioBase64.includes('mock_pay')) {
      decodedText =
        language === 'hi' ? 'मेरे ऑर्डर का भुगतान करें' : 'pay for my order';
    } else if (audioBase64.includes('mock_human')) {
      decodedText = language === 'hi' ? 'इंसान से बात करो' : 'talk to human';
    }

    const intent = this.voicePhrases[decodedText] || 'intent:UNKNOWN';
    return { text: decodedText, intent };
  }

  async textToSpeech(
    text: string,
    language: 'en' | 'hi' | 'te' | 'ta' | 'kn',
  ): Promise<{ audioUrl: string; base64Audio: string }> {
    if (!text) throw new BadRequestException('Text is required');

    // Simulate generating TTS audio buffer
    const mockAudioBase64 =
      'SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA'; // Mock MP3 header
    return {
      audioUrl: `/static/audio/mock_${language}_${Date.now()}.mp3`,
      base64Audio: mockAudioBase64,
    };
  }
}
