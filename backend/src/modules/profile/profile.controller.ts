import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('User Profile & Identity Management')
@Controller('profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @ApiOperation({ summary: 'Retrieve currently logged-in user, seller, or vendor profile details' })
  async getProfile(@Request() req: any) {
    return this.profileService.getProfile(req.user.id);
  }

  @Put('update')
  @ApiOperation({ summary: 'Update personal profile details or merchant shop settings' })
  async updateProfile(@Request() req: any, @Body() dto: any) {
    return this.profileService.updateProfile(req.user.id, dto);
  }

  @Post('avatar')
  @ApiOperation({ summary: 'Update profile photo avatar link' })
  async updateAvatar(@Request() req: any, @Body('avatarUrl') avatarUrl: string) {
    return this.profileService.updateAvatar(req.user.id, avatarUrl);
  }

  @Get('addresses')
  @ApiOperation({ summary: 'List all customer saved shipping/billing addresses' })
  async getAddresses(@Request() req: any) {
    return this.profileService.getAddresses(req.user.id);
  }

  @Post('addresses')
  @ApiOperation({ summary: 'Add a new shipping/billing address' })
  async addAddress(@Request() req: any, @Body() dto: any) {
    return this.profileService.addAddress(req.user.id, dto);
  }

  @Put('addresses/:id')
  @ApiOperation({ summary: 'Edit details of an existing shipping address' })
  async updateAddress(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.profileService.updateAddress(req.user.id, id, dto);
  }

  @Delete('addresses/:id')
  @ApiOperation({ summary: 'Remove a saved shipping/billing address' })
  async deleteAddress(@Request() req: any, @Param('id') id: string) {
    return this.profileService.deleteAddress(req.user.id, id);
  }

  @Post('security/password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Change user/seller/vendor console account password' })
  async changePassword(@Request() req: any, @Body() dto: any) {
    return this.profileService.changePassword(req.user.id, dto);
  }

  @Post('security/2fa')
  @HttpCode(200)
  @ApiOperation({ summary: 'Enable or disable Multi-Factor Authentication (2FA)' })
  async toggleTfa(
    @Request() req: any,
    @Body('enabled') enabled: boolean,
    @Body('secret') secret?: string,
  ) {
    return this.profileService.toggleTfa(req.user.id, enabled, secret);
  }

  @Get('security/sessions')
  @ApiOperation({ summary: 'List active device sessions and last logins' })
  async getSessions(@Request() req: any) {
    return this.profileService.getSessions(req.user.id);
  }

  @Delete('security/sessions/:deviceId')
  @ApiOperation({ summary: 'Revoke and terminate a specific device session' })
  async revokeSession(@Request() req: any, @Param('deviceId') deviceId: string) {
    return this.profileService.revokeSession(req.user.id, deviceId);
  }

  @Delete('security/sessions')
  @ApiOperation({ summary: 'Terminate all active device sessions except current' })
  async revokeOtherSessions(
    @Request() req: any,
    @Query('currentDeviceId') currentDeviceId: string,
  ) {
    return this.profileService.revokeOtherSessions(req.user.id, currentDeviceId);
  }

  @Get('wallet')
  @ApiOperation({ summary: 'Retrieve wallet transaction ledger and cashback statements' })
  async getWalletTransactions(@Request() req: any) {
    return this.profileService.getWalletTransactions(req.user.id);
  }

  @Post('wallet')
  @ApiOperation({ summary: 'Simulate adding cash funds to user wallet balance' })
  async addWalletFunds(
    @Request() req: any,
    @Body('amount') amount: number,
    @Body('description') description?: string,
  ) {
    return this.profileService.addWalletFunds(req.user.id, amount, description);
  }

  @Post('rewards/convert')
  @HttpCode(200)
  @ApiOperation({ summary: 'Convert reward points to wallet shopping balance credit' })
  async convertPoints(@Request() req: any, @Body('points') points: number) {
    return this.profileService.convertPoints(req.user.id, points);
  }

  @Get('payments')
  @ApiOperation({ summary: 'List customer saved tokenized cards, UPIs, or wallets' })
  async getPaymentMethods(@Request() req: any) {
    return this.profileService.getPaymentMethods(req.user.id);
  }

  @Post('payments')
  @ApiOperation({ summary: 'Add a new saved payment card or wallet account' })
  async addPaymentMethod(@Request() req: any, @Body() dto: any) {
    return this.profileService.addPaymentMethod(req.user.id, dto);
  }

  @Delete('payments/:id')
  @ApiOperation({ summary: 'Delete a saved payment method card' })
  async deletePaymentMethod(@Request() req: any, @Param('id') id: string) {
    return this.profileService.deletePaymentMethod(req.user.id, id);
  }

  @Get('referrals')
  @ApiOperation({ summary: 'Get referral codes, link clicks, and referred user logs' })
  async getReferrals(@Request() req: any) {
    return this.profileService.getReferrals(req.user.id);
  }

  @Get('logs')
  @ApiOperation({ summary: 'Retrieve security audit log trail of account updates' })
  async getAuditLogs(@Request() req: any) {
    return this.profileService.getAuditLogs(req.user.id);
  }

  @Get('tickets')
  @ApiOperation({ summary: 'List user customer support tickets' })
  async getTickets(@Request() req: any) {
    return this.profileService.getTickets(req.user.id);
  }

  @Post('tickets')
  @ApiOperation({ summary: 'Create or raise a new support helpline ticket' })
  async createTicket(@Request() req: any, @Body() dto: any) {
    return this.profileService.createTicket(req.user.id, dto);
  }

  @Get('export')
  @ApiOperation({ summary: 'GDPR Right to Portability: Download full personal data snapshot' })
  async exportData(@Request() req: any) {
    return this.profileService.exportData(req.user.id);
  }

  @Post('delete-request')
  @HttpCode(200)
  @ApiOperation({ summary: 'GDPR Right to Erasure: Request account deletion' })
  async requestDeletion(@Request() req: any) {
    return this.profileService.requestDeletion(req.user.id);
  }
}
