import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('Notification Engine')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user notifications' })
  async getNotifications(@Request() req: any) {
    return this.notificationService.getUserNotifications(req.user.id);
  }

  @Put('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllRead(@Request() req: any) {
    return this.notificationService.markAllAsRead(req.user.id);
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  async markRead(@Request() req: any, @Param('id') id: string) {
    return this.notificationService.markAsRead(req.user.id, id);
  }

  @Delete('clear-all')
  @ApiOperation({ summary: 'Clear all notifications' })
  async clearAll(@Request() req: any) {
    return this.notificationService.clearAllNotifications(req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a single notification' })
  async deleteNotification(@Request() req: any, @Param('id') id: string) {
    return this.notificationService.deleteNotification(req.user.id, id);
  }

  @Post('send')
  @ApiOperation({ summary: 'Send transactional notification' })
  async send(
    @Request() req: any,
    @Body('type') type: string,
    @Body('channel') channel: 'Email' | 'SMS' | 'Push' | 'WhatsApp' | 'In-App',
    @Body('payload') payload: any,
  ) {
    return this.notificationService.sendNotification(
      req.user.id,
      type,
      channel,
      payload,
    );
  }

  @Post('schedule')
  @ApiOperation({ summary: 'Schedule delayed notification send' })
  async schedule(
    @Request() req: any,
    @Body('type') type: string,
    @Body('channel') channel: 'Email' | 'SMS' | 'Push' | 'WhatsApp' | 'In-App',
    @Body('payload') payload: any,
    @Body('delayMs') delayMs: number,
  ) {
    return this.notificationService.scheduleNotification(
      req.user.id,
      type,
      channel,
      payload,
      delayMs,
    );
  }

  @Get('preferences')
  @ApiOperation({ summary: 'Get current user preferences' })
  async getPrefs(@Request() req: any) {
    return this.notificationService.getPreferences(req.user.id);
  }

  @Put('preferences')
  @ApiOperation({ summary: 'Update user notification settings preferences' })
  async updatePrefs(@Request() req: any, @Body() body: any) {
    return this.notificationService.updatePreferences(req.user.id, body);
  }
}
