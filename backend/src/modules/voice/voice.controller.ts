import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { VoiceService } from './voice.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Voice Commerce (STT, TTS, Voice Intent)')
@Controller('voice')
export class VoiceController {
  constructor(private readonly voiceService: VoiceService) {}

  @Post('stt')
  @ApiOperation({ summary: 'Speech to Text conversion' })
  async speechToText(
    @Body('audio') audio: string, // Base64 audio string
    @Body('language') language: 'en' | 'hi' | 'te' | 'ta' | 'kn',
  ) {
    if (!language) throw new BadRequestException('Language is required');
    return this.voiceService.speechToText(audio, language);
  }

  @Post('tts')
  @ApiOperation({ summary: 'Text to Speech synthesis' })
  async textToSpeech(
    @Body('text') text: string,
    @Body('language') language: 'en' | 'hi' | 'te' | 'ta' | 'kn',
  ) {
    if (!language) throw new BadRequestException('Language is required');
    return this.voiceService.textToSpeech(text, language);
  }
}
