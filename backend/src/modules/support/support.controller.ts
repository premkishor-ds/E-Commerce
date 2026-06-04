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
}
