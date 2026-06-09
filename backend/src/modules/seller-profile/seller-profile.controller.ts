import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SellerProfileService } from './seller-profile.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/rbac.guard';
import { Roles } from '../auth/rbac.decorator';

@ApiTags('Seller Profiles')
@Controller('seller-profiles')
export class SellerProfileController {
  constructor(private readonly sellerProfileService: SellerProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active sellers' })
  async getSellers() {
    return this.sellerProfileService.getSellers();
  }

  @Get('my-profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current logged in seller profile' })
  async getMyProfile(@Request() req: any) {
    return this.sellerProfileService.getSellerByUser(req.user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create seller profile' })
  async create(@Request() req: any, @Body() dto: any) {
    return this.sellerProfileService.create(dto, req.user.id);
  }

  @Put('my-profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update seller profile' })
  async updateMyProfile(@Request() req: any, @Body() dto: any) {
    return this.sellerProfileService.update(req.user.id, dto);
  }
}
