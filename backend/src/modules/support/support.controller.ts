import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SupportService } from './support.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/rbac.guard';
import { Roles } from '../auth/rbac.decorator';

@ApiTags('Support Ticketing & Live Chats')
@Controller('support')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('tickets')
  @ApiOperation({ summary: 'Create a new support ticket' })
  async createTicket(@Request() req: any, @Body() dto: any) {
    return this.supportService.createTicket(req.user.id, dto);
  }

  @Get('tickets/my')
  @ApiOperation({ summary: 'Get current customer tickets' })
  async getMyTickets(@Request() req: any) {
    return this.supportService.getCustomerTickets(req.user.id);
  }

  @Get('tickets')
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Super Admin', 'Customer Support')
  @ApiOperation({ summary: 'Get all platform support tickets (Staff)' })
  async getAllTickets() {
    return this.supportService.getAllTickets();
  }

  @Get('tickets/:id')
  @ApiOperation({ summary: 'Get details of specific ticket' })
  async getTicketById(@Param('id') id: string) {
    return this.supportService.getTicketById(id);
  }

  @Post('tickets/:id/reply')
  @ApiOperation({ summary: 'Reply to support ticket' })
  async replyToTicket(
    @Param('id') id: string,
    @Request() req: any,
    @Body('message') message: string,
  ) {
    return this.supportService.replyToTicket(id, req.user.id, message);
  }

  @Put('tickets/:id/assign')
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Super Admin', 'Customer Support')
  @ApiOperation({ summary: 'Assign support ticket to agent (Staff)' })
  async assignTicket(
    @Param('id') id: string,
    @Body('agentId') agentId: string,
  ) {
    return this.supportService.assignTicket(id, agentId);
  }

  @Put('tickets/:id/status')
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Super Admin', 'Customer Support')
  @ApiOperation({ summary: 'Close or update support ticket status (Staff)' })
  async updateTicketStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.supportService.updateTicketStatus(id, status);
  }

  // --- LIVE CHAT FEATURES ---

  @Post('agent/status')
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Super Admin', 'Customer Support')
  @ApiOperation({ summary: 'Set agent status (Staff)' })
  async setAgentStatus(@Request() req: any, @Body('status') status: string) {
    return this.supportService.setAgentStatus(req.user.id, status);
  }

  @Post('agent/notes')
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Super Admin', 'Customer Support')
  @ApiOperation({ summary: 'Add agent note (Staff)' })
  async addAgentNote(@Request() req: any, @Body('note') note: string) {
    return this.supportService.addAgentNote(req.user.id, note);
  }

  @Get('agents/available')
  @ApiOperation({ summary: 'Get list of available support agents' })
  async getAvailableAgents() {
    return this.supportService.getAvailableAgents();
  }

  @Post('chat/session')
  @ApiOperation({ summary: 'Start a live chat session (Handoff)' })
  async startLiveChat(@Request() req: any, @Body('skills') skills?: string[]) {
    const primaryRole = req.user.roles && req.user.roles.length > 0 ? req.user.roles[0] : 'Customer';
    return this.supportService.startLiveChatSession(req.user.id, skills || [], primaryRole);
  }

  @Post('chat/session/:id/message')
  @ApiOperation({ summary: 'Send message in a live chat session' })
  async sendChatMessage(
    @Param('id') id: string,
    @Request() req: any,
    @Body('senderName') senderName: string,
    @Body('message') message: string,
    @Body('attachmentUrl') attachmentUrl?: string,
  ) {
    return this.supportService.sendChatMessage(
      id,
      req.user.id,
      senderName || 'User',
      message,
      attachmentUrl,
    );
  }


  @Post('chat/session/:id/rate')
  @ApiOperation({ summary: 'Rate a closed live chat session' })
  async rateSession(@Param('id') id: string, @Body('rating') rating: number) {
    return this.supportService.rateLiveChatSession(id, rating);
  }

  @Post('chat/session/:id/close')
  @ApiOperation({ summary: 'Force close active live chat session' })
  async closeSession(@Param('id') id: string, @Body('rating') rating?: number) {
    return this.supportService.forceCloseSession(id, rating);
  }

  @Post('chat/session/:id/transfer')
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Super Admin', 'Customer Support')
  @ApiOperation({
    summary: 'Transfer active chat session to another agent (Staff)',
  })
  async transferSession(
    @Param('id') id: string,
    @Body('targetAgentId') targetAgentId: string,
  ) {
    return this.supportService.transferSession(id, targetAgentId);
  }

  @Get('chat/sessions/active')
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Super Admin', 'Customer Support')
  @ApiOperation({ summary: 'Monitor active live chat sessions (Admin/Staff)' })
  async getActiveSessions() {
    return this.supportService.getActiveSessions();
  }

  @Get('chat/sessions/history')
  @ApiOperation({ summary: 'Get user live chat session history' })
  async getSessionHistory(@Request() req: any) {
    return this.supportService.getSessionHistory(req.user.id);
  }
}
