import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { JwtAuthGuard } from './jwt.guard';

class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  roles?: string[];

  @IsOptional()
  shopName?: string;
}

class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

class SendOtpDto {
  @IsNotEmpty()
  phone: string;
}

class VerifyOtpDto {
  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  code: string;
}

class RefreshDto {
  @IsNotEmpty()
  refreshToken: string;
}

class VerifyMfaDto {
  @IsNotEmpty()
  code: string;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in with email & password' })
  @ApiResponse({ status: 200, description: 'Authentication successful.' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('otp/send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send OTP code to registered mobile number' })
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto.phone);
  }

  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP code and authenticate' })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto.phone, dto.code);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh JWT access tokens' })
  async refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('mfa/setup')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set up Multi-Factor Authentication' })
  async setupMfa(@Request() req: any) {
    return this.authService.setupMfa(req.user.id);
  }

  @Post('mfa/verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify Multi-Factor Authentication code to enable' })
  async verifyMfa(@Request() req: any, @Body() dto: VerifyMfaDto) {
    return this.authService.verifyMfa(req.user.id, dto.code);
  }
}
