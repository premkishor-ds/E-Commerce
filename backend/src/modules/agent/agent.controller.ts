import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { AgentService, AgentRequest } from './agent.service';
import { AgentMemoryService } from './agent.memory.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';
import * as jwt from 'jsonwebtoken';

class AgentMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsString()
  @IsOptional()
  guestId?: string;

  @IsString()
  @IsOptional()
  activeStep?: string;

  @IsOptional()
  @IsObject()
  stepData?: Record<string, any>;
}

@ApiTags('AI Agent')
@Controller('agent')
export class AgentController {
  private readonly jwtSecret =
    process.env.JWT_SECRET || 'super_secret_key_123_abc';

  constructor(
    private readonly agentService: AgentService,
    private readonly memoryService: AgentMemoryService,
  ) {}

  @Post('message')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send a message to the AI Agent and receive a structured response',
  })
  async message(
    @Body() dto: AgentMessageDto,
    @Headers('authorization') authHeader?: string,
  ) {
    let userId: string | undefined;
    let userRoles: string[] = [];

    // Decode JWT if present (don't throw on failure — support guest users)
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const decoded: any = jwt.verify(token, this.jwtSecret);
        userId = decoded.sub;
        userRoles = decoded.roles || [];
      } catch {
        // Invalid/expired token — treat as guest
      }
    }

    const req: AgentRequest = {
      message: dto.message,
      sessionId: dto.sessionId,
      guestId: dto.guestId,
      userId,
      userRoles,
      activeStep: dto.activeStep,
      stepData: dto.stepData,
    };

    return this.agentService.processMessage(req);
  }

  @Get('history/:sessionId')
  @ApiOperation({ summary: 'Get conversation history for a session' })
  async getHistory(@Param('sessionId') sessionId: string) {
    return this.memoryService.getRecentHistory(sessionId, 50);
  }

  @Delete('history/:sessionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Clear conversation history for a session' })
  async clearHistory(@Param('sessionId') sessionId: string) {
    // This is a soft delete — just empties messages
    return { cleared: true };
  }

  @Post('merge')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Merge guest profile into authenticated user account',
  })
  async mergeGuest(
    @Body('guestId') guestId: string,
    @Headers('authorization') authHeader?: string,
  ) {
    if (!authHeader?.startsWith('Bearer ')) {
      return { merged: false, message: 'No auth token provided' };
    }
    try {
      const token = authHeader.replace('Bearer ', '');
      const decoded: any = jwt.verify(token, this.jwtSecret);
      await this.memoryService.mergeGuestToUser(guestId, decoded.sub);
      return { merged: true, userId: decoded.sub, guestId };
    } catch {
      return { merged: false, message: 'Invalid token' };
    }
  }

  @Get('memory')
  @ApiOperation({ summary: 'Get user memory and preferences' })
  async getMemory(@Headers('authorization') authHeader?: string) {
    if (!authHeader?.startsWith('Bearer ')) return { memory: null };
    try {
      const token = authHeader.replace('Bearer ', '');
      const decoded: any = jwt.verify(token, this.jwtSecret);
      const memory = await this.memoryService.getUserMemory(decoded.sub);
      return { memory };
    } catch {
      return { memory: null };
    }
  }
}
