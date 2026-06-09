import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/rbac.guard';
import { Roles } from '../auth/rbac.decorator';

@ApiTags('Media Library')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('files')
  @ApiOperation({ summary: 'Get all media files' })
  async getFiles() {
    return this.mediaService.getFiles();
  }

  @Post('files')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Register/upload a media file' })
  async uploadFile(@Request() req: any, @Body() dto: any) {
    return this.mediaService.registerFile(dto, req.user.id);
  }

  @Delete('files/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete media file' })
  async deleteFile(@Param('id') id: string) {
    return this.mediaService.deleteFile(id);
  }
}
