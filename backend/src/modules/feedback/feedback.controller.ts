import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Body, 
  Param, 
  Query, 
  Request, 
  UseGuards, 
  ForbiddenException 
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/rbac.guard';
import { Roles } from '../auth/rbac.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Feedback & Bug Reports')
@Controller()
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  // 1. PUBLIC / GUEST: Submit Feedback
  @Post('feedback/submit')
  @ApiOperation({ summary: 'Submit feedback (Guest or Public)' })
  async submitGuestFeedback(@Body() dto: any) {
    return this.feedbackService.submitFeedback(dto, null);
  }

  // 2. LOGGED-IN: Submit Feedback
  @Post('feedback/submit-logged-in')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Submit feedback (Logged-in user)' })
  async submitUserFeedback(@Request() req: any, @Body() dto: any) {
    return this.feedbackService.submitFeedback(dto, req.user);
  }

  // 3. PUBLIC / GUEST: Check duplicate bug reports / features
  @Get('feedback/duplicates')
  @ApiOperation({ summary: 'Find duplicate feature requests or bug reports' })
  async getDuplicates(@Query('type') type: string, @Query('subject') subject: string) {
    return this.feedbackService.detectDuplicates(type || 'Feature Request', subject || '');
  }

  // 4. LOGGED-IN: Vote on feature request
  @Post('feedback/:id/vote')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Vote on a feature request' })
  async voteFeature(@Param('id') id: string, @Request() req: any) {
    return this.feedbackService.voteFeature(id, req.user.id);
  }

  // 5. PUBLIC / LOGGED-IN: Submit satisfaction survey
  @Post('feedback/:id/survey')
  @ApiOperation({ summary: 'Submit user satisfaction survey after ticket closure' })
  async submitSurvey(@Param('id') id: string, @Body() body: { rating: number; comment?: string }) {
    return this.feedbackService.submitSurvey(id, body);
  }

  // ================= ADMIN & STAFF WORKSPACE =================

  // 6. ADMIN: Analytics Dashboard Summary
  @Get('admin/feedback/dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin', 'Support Agent')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get feedback stats and breakdown metrics' })
  async getDashboard() {
    return this.feedbackService.getStatsDashboard();
  }

  // 7. ADMIN: Feedback Listing (filtered, sorted, paginated)
  @Get('admin/feedback')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin', 'Support Agent')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'List and search all feedback tickets' })
  async getList(@Query() query: any, @Request() req: any) {
    return this.feedbackService.getFeedbackList(query, req.user);
  }

  // 8. ADMIN: Ticket detail with full history, comments, and tech context
  @Get('admin/feedback/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin', 'Support Agent')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get details of specific feedback ticket' })
  async getDetail(@Param('id') id: string, @Request() req: any) {
    return this.feedbackService.getFeedbackDetail(id, req.user);
  }

  // 9. ADMIN: Update Workflow Status
  @Put('admin/feedback/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin', 'Support Agent')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update ticket workflow status' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Request() req: any
  ) {
    return this.feedbackService.updateStatus(id, status, req.user);
  }

  // 10. ADMIN: Assign / Reassign Ticket
  @Put('admin/feedback/:id/assign')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin', 'Support Agent')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Assign ticket to a department and agent' })
  async assignTicket(
    @Param('id') id: string,
    @Body('team') team: string,
    @Body('agentId') agentId: string,
    @Request() req: any
  ) {
    return this.feedbackService.assignTicket(id, team, agentId || null, req.user);
  }

  // 11. ADMIN: Update Roadmap status (Features only)
  @Put('admin/feedback/:id/roadmap')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin', 'Support Agent')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update feature roadmap progress status' })
  async updateRoadmap(
    @Param('id') id: string,
    @Body('roadmapStatus') roadmapStatus: string,
    @Request() req: any
  ) {
    return this.feedbackService.updateRoadmap(id, roadmapStatus, req.user);
  }

  // 12. ADMIN: Add User Reply or Private Internal Note
  @Post('admin/feedback/:id/comments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Super Admin', 'Support Agent')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Add reply or private internal note' })
  async addComment(
    @Param('id') id: string,
    @Body('text') text: string,
    @Body('isPrivate') isPrivate: boolean,
    @Request() req: any
  ) {
    return this.feedbackService.addComment(id, text, isPrivate, req.user);
  }
}
