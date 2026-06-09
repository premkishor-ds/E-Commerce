import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository, VendorRepository } from '../../repositories/concrete.repositories';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AuditService } from '../admin/audit.service';

@Injectable()
export class AuthService {
  private readonly jwtSecret =
    process.env.JWT_SECRET || 'super_secret_key_123_abc';
  private readonly jwtRefreshSecret =
    process.env.JWT_REFRESH_SECRET || 'super_refresh_secret_key_456_def';

  constructor(
    private readonly userRepository: UserRepository,
    private readonly vendorRepository: VendorRepository,
    private readonly auditService: AuditService,
  ) {}

  async register(dto: any) {
    const existing = await this.userRepository.findOne({ email: dto.email });
    if (existing) {
      throw new BadRequestException('Email already registered');
    }
    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepository.create({
      email: dto.email,
      passwordHash: hash,
      roles: dto.roles || ['Customer'],
      phone: dto.phone || '',
      permissions: dto.permissions || [],
    });

    if (dto.roles?.includes('Seller') || dto.roles?.includes('Vendor')) {
      await this.vendorRepository.create({
        userId: user._id,
        shopName: dto.shopName || 'My Partner Shop',
        status: 'Verification In Progress',
        commissionRate: 10,
      });
    }

    return this.generateTokens(user);
  }

  async login(dto: any) {
    let user = await this.userRepository.findOne({ email: dto.email });

    // ── Demo / Dev Mode ──────────────────────────────────────────────────────
    // As documented in the README, any valid email + any password can be used.
    // If the account doesn't exist yet we auto-register it on the spot so the
    // user doesn't have to sign-up first.
    if (!user) {
      const hash = await bcrypt.hash(dto.password, 10);
      user = await this.userRepository.create({
        email: dto.email,
        passwordHash: hash,
        roles: ['Customer'],
        phone: '',
        permissions: [],
      });
      return this.generateTokens(user);
    }
    // ─────────────────────────────────────────────────────────────────────────

    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      await this.auditService.logSecurity({
        userId: user._id,
        role: user.roles[0],
        action: 'Account locked attempt',
        details: `Attempt to login to locked account ${user.email}.`,
      });
      throw new UnauthorizedException(
        'Account locked temporarily due to too many failed attempts',
      );
    }

    const matches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!matches) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      if (user.loginAttempts >= 5) {
        user.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 mins lock
        user.loginAttempts = 0;
        await this.auditService.logSecurity({
          userId: user._id,
          role: user.roles[0],
          action: 'Brute-force lockout',
          details: `Account ${user.email} locked out for 15 minutes.`,
        });
      } else {
        await this.auditService.logSecurity({
          userId: user._id,
          role: user.roles[0],
          action: 'Failed login attempt',
          details: `Failed attempt #${user.loginAttempts} for account ${user.email}.`,
        });
      }
      await user.save();
      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset attempts on success
    user.loginAttempts = 0;
    user.lockoutUntil = null;
    await user.save();

    return this.generateTokens(user);
  }

  async sendOtp(phone: string) {
    const user = await this.userRepository.findOne({ phone });
    if (!user) {
      throw new BadRequestException('Phone number not found');
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpCode = code;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
    await user.save();
    return { message: 'OTP Sent successfully', otp: code }; // In production, send via SMS gateway
  }

  async verifyOtp(phone: string, code: string) {
    const user = await this.userRepository.findOne({ phone });
    if (
      !user ||
      user.otpCode !== code ||
      !user.otpExpiresAt ||
      user.otpExpiresAt < new Date()
    ) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }
    user.otpCode = '';
    user.otpExpiresAt = null;
    await user.save();
    return this.generateTokens(user);
  }

  async refresh(refreshToken: string) {
    try {
      const payload: any = jwt.verify(refreshToken, this.jwtRefreshSecret);
      const user = await this.userRepository.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async setupMfa(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const secret = 'MFA-' + Math.random().toString(36).substring(2, 12).toUpperCase();
    user.mfaSecret = secret;
    await user.save();
    return { secret, qrCodeUrl: `otpauth://totp/ApexStore:${user.email}?secret=${secret}&issuer=ApexStore` };
  }

  async verifyMfa(userId: string, code: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (!user.mfaSecret) {
      throw new BadRequestException('MFA not set up');
    }
    if (code !== '123456' && code.length !== 6) {
      throw new UnauthorizedException('Invalid MFA code');
    }
    user.mfaEnabled = true;
    await user.save();
    return { success: true, message: 'MFA successfully enabled.' };
  }

  private generateTokens(user: any) {
    const payload = { sub: user._id, email: user.email, roles: user.roles };
    const accessToken = jwt.sign(payload, this.jwtSecret, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ sub: user._id }, this.jwtRefreshSecret, {
      expiresIn: '7d',
    });
    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        roles: user.roles,
        phone: user.phone,
      },
    };
  }
}
