import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import {
  UserRepository,
  AddressRepository,
  PaymentMethodRepository,
  WalletTransactionRepository,
  ReferralRepository,
  OrderRepository,
  TicketRepository,
  LogRepository,
  VendorRepository,
  ReviewRepository,
} from '../../repositories/concrete.repositories';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';

@Injectable()
export class ProfileService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly addressRepository: AddressRepository,
    private readonly paymentMethodRepository: PaymentMethodRepository,
    private readonly walletTransactionRepository: WalletTransactionRepository,
    private readonly referralRepository: ReferralRepository,
    private readonly orderRepository: OrderRepository,
    private readonly ticketRepository: TicketRepository,
    private readonly logRepository: LogRepository,
    private readonly vendorRepository: VendorRepository,
    private readonly reviewRepository: ReviewRepository,
  ) {}

  // AUDIT LOG HELPER
  private async logActivity(userId: string, type: string, action: string, details: string) {
    await this.logRepository.create({
      userId: new Types.ObjectId(userId),
      type,
      action,
      details,
    });
  }

  // PROFILE DETAILS
  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const basicProfile: any = {
      id: user._id,
      email: user.email,
      phone: user.phone,
      roles: user.roles,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      displayName: user.displayName || '',
      username: user.username || '',
      alternatePhone: user.alternatePhone || '',
      dob: user.dob,
      gender: user.gender || '',
      profilePhoto: user.profilePhoto || '',
      languagePreference: user.languagePreference || 'en',
      currencyPreference: user.currencyPreference || 'USD',
      timezone: user.timezone || 'UTC',
      membershipLevel: user.membershipLevel || 'Silver',
      rewardPoints: user.rewardPoints || 0,
      walletBalance: user.walletBalance || 0,
      accountStatus: user.accountStatus || 'Active',
      verificationStatus: user.verificationStatus || false,
      lastLogin: user.lastLogin,
      marketingEmails: user.marketingEmails !== false,
      productRecommendations: user.productRecommendations !== false,
      newsletterSubscriptions: user.newsletterSubscriptions !== false,
      referralCode: user.referralCode || `REF-${user.email.split('@')[0].toUpperCase()}`,
      referralEarnings: user.referralEarnings || 0,
      subscriptionPlan: user.subscriptionPlan || 'Free',
      billingCycle: user.billingCycle || 'Monthly',
      nextRenewal: user.nextRenewal,
      mfaEnabled: user.mfaEnabled || false,
    };

    // If user is Seller or Vendor, fetch shop/vendor details
    if (user.roles.includes('Seller') || user.roles.includes('Vendor')) {
      const vendorInfo = await this.vendorRepository.findOne({ userId: user._id });
      if (vendorInfo) {
        basicProfile.shopName = vendorInfo.shopName;
        basicProfile.companyLegalName = vendorInfo.companyLegalName || '';
        basicProfile.businessPhone = vendorInfo.businessPhone || '';
        basicProfile.bankAccountDetails = vendorInfo.bankAccountDetails || null;
        basicProfile.commissionRate = vendorInfo.commissionRate;
      }
    }

    return basicProfile;
  }

  async updateProfile(userId: string, dto: any) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    // Check username duplicates if changed
    if (dto.username && dto.username !== user.username) {
      const duplicate = await this.userRepository.findOne({ username: dto.username });
      if (duplicate) throw new BadRequestException('Username is already taken');
      user.username = dto.username;
    }

    const fields = [
      'firstName',
      'lastName',
      'displayName',
      'alternatePhone',
      'gender',
      'languagePreference',
      'currencyPreference',
      'timezone',
      'marketingEmails',
      'productRecommendations',
      'newsletterSubscriptions',
    ];

    fields.forEach((field) => {
      if (dto[field] !== undefined) {
        (user as any)[field] = dto[field];
      }
    });

    if (dto.dob !== undefined) {
      user.dob = dto.dob ? new Date(dto.dob) : null;
    }

    if (dto.phone !== undefined) {
      user.phone = dto.phone;
    }

    await user.save();

    // If user is Seller/Vendor, update the vendor settings too
    if (user.roles.includes('Seller') || user.roles.includes('Vendor')) {
      let vendorInfo = await this.vendorRepository.findOne({ userId: user._id });
      if (!vendorInfo) {
        vendorInfo = await this.vendorRepository.create({
          userId: user._id,
          shopName: dto.shopName || 'My Partner Shop',
          commissionRate: 10,
        });
      }

      if (dto.shopName !== undefined) vendorInfo.shopName = dto.shopName;
      if (dto.companyLegalName !== undefined) vendorInfo.companyLegalName = dto.companyLegalName;
      if (dto.businessPhone !== undefined) vendorInfo.businessPhone = dto.businessPhone;
      if (dto.bankAccountDetails !== undefined) vendorInfo.bankAccountDetails = dto.bankAccountDetails;

      await vendorInfo.save();
    }

    await this.logActivity(userId, 'Audit', 'Profile Updated', 'User changed profile details');
    return this.getProfile(userId);
  }

  // AVATAR
  async updateAvatar(userId: string, avatarUrl: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    user.profilePhoto = avatarUrl;
    await user.save();
    await this.logActivity(userId, 'Audit', 'Avatar Updated', 'User updated profile photo');
    return { profilePhoto: user.profilePhoto };
  }

  // ADDRESSES
  async getAddresses(userId: string) {
    return this.addressRepository.find({ userId: new Types.ObjectId(userId) });
  }

  async addAddress(userId: string, dto: any) {
    if (dto.isDefault) {
      await this.addressRepository.update(
        { userId: new Types.ObjectId(userId) } as any,
        { isDefault: false },
      );
    }
    const address = await this.addressRepository.create({
      ...dto,
      userId: new Types.ObjectId(userId),
    });
    await this.logActivity(userId, 'Audit', 'Address Added', `Added address: ${dto.fullName}, ${dto.city}`);
    return address;
  }

  async updateAddress(userId: string, addressId: string, dto: any) {
    if (dto.isDefault) {
      await this.addressRepository.update(
        { userId: new Types.ObjectId(userId), _id: { $ne: new Types.ObjectId(addressId) } } as any,
        { isDefault: false },
      );
    }
    const updated = await this.addressRepository.update(addressId, dto);
    await this.logActivity(userId, 'Audit', 'Address Updated', `Updated address: ${addressId}`);
    return updated;
  }

  async deleteAddress(userId: string, addressId: string) {
    await this.addressRepository.delete(addressId);
    await this.logActivity(userId, 'Audit', 'Address Deleted', `Deleted address: ${addressId}`);
    return { success: true };
  }

  // SECURITY: PASSWORD
  async changePassword(userId: string, dto: any) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const matches = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!matches) throw new BadRequestException('Incorrect current password');

    const passwordHistoryCheck = await bcrypt.compare(dto.newPassword, user.passwordHash);
    if (passwordHistoryCheck) throw new BadRequestException('New password cannot be the same as your old password');

    user.passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await user.save();
    await this.logActivity(userId, 'Security', 'Password Changed', 'User modified credential password');
    return { success: true };
  }

  // SECURITY: TFA
  async toggleTfa(userId: string, enabled: boolean, secret?: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    user.mfaEnabled = enabled;
    if (enabled && secret) {
      user.mfaSecret = secret;
      user.backupCodes = Array.from({ length: 5 }, () =>
        Math.floor(10000000 + Math.random() * 90000000).toString(),
      );
    } else {
      user.mfaSecret = '';
      user.backupCodes = [];
    }

    await user.save();
    await this.logActivity(userId, 'Security', '2FA Status Modified', `Set 2FA status: ${enabled}`);
    return { mfaEnabled: user.mfaEnabled, backupCodes: user.backupCodes };
  }

  // SECURITY: SESSIONS
  async getSessions(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return user.devices || [];
  }

  async revokeSession(userId: string, deviceId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    user.devices = (user.devices || []).filter((d) => d.deviceId !== deviceId);
    await user.save();
    await this.logActivity(userId, 'Security', 'Session Revoked', `Revoked device session: ${deviceId}`);
    return user.devices;
  }

  async revokeOtherSessions(userId: string, currentDeviceId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    user.devices = (user.devices || []).filter((d) => d.deviceId === currentDeviceId);
    await user.save();
    await this.logActivity(userId, 'Security', 'Other Sessions Revoked', 'Cleared all other device tokens');
    return user.devices;
  }

  // WALLET & LOYALTY
  async getWalletTransactions(userId: string) {
    return this.walletTransactionRepository.find({ userId: new Types.ObjectId(userId) }, { sort: { createdAt: -1 } });
  }

  async addWalletFunds(userId: string, amount: number, description: string = 'Add cash funds') {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    user.walletBalance = (user.walletBalance || 0) + amount;
    await user.save();

    await this.walletTransactionRepository.create({
      userId: user._id,
      amount,
      transactionType: 'Credit',
      description,
      status: 'Completed',
    });

    await this.logActivity(userId, 'Audit', 'Funds Added', `Added $${amount} to wallet balance`);
    return { walletBalance: user.walletBalance };
  }

  async convertPoints(userId: string, points: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (points <= 0 || (user.rewardPoints || 0) < points) {
      throw new BadRequestException('Insufficient reward points');
    }

    // Conversion rate: 100 points = $1 wallet credit
    const credit = points / 100;
    user.rewardPoints = (user.rewardPoints || 0) - points;
    user.walletBalance = (user.walletBalance || 0) + credit;
    await user.save();

    await this.walletTransactionRepository.create({
      userId: user._id,
      amount: credit,
      transactionType: 'Cashback',
      description: `Converted ${points} points to wallet credit`,
      status: 'Completed',
    });

    await this.logActivity(userId, 'Audit', 'Points Converted', `Converted ${points} points to $${credit}`);
    return { rewardPoints: user.rewardPoints, walletBalance: user.walletBalance };
  }

  // SAVED PAYMENT METHODS
  async getPaymentMethods(userId: string) {
    return this.paymentMethodRepository.find({ userId: new Types.ObjectId(userId) });
  }

  async addPaymentMethod(userId: string, dto: any) {
    if (dto.isDefault) {
      await this.paymentMethodRepository.update(
        { userId: new Types.ObjectId(userId) } as any,
        { isDefault: false },
      );
    }
    const pay = await this.paymentMethodRepository.create({
      ...dto,
      userId: new Types.ObjectId(userId),
    });
    await this.logActivity(userId, 'Audit', 'Payment Method Added', `Saved payment type: ${dto.type}`);
    return pay;
  }

  async deletePaymentMethod(userId: string, paymentId: string) {
    await this.paymentMethodRepository.delete(paymentId);
    await this.logActivity(userId, 'Audit', 'Payment Method Deleted', `Deleted payment method ID: ${paymentId}`);
    return { success: true };
  }

  // REFERRALS
  async getReferrals(userId: string) {
    const referrals = await this.referralRepository.find({ referrerId: new Types.ObjectId(userId) });
    // Join with referred user details manually/simulated
    const joined = [];
    for (const r of referrals) {
      const user = await this.userRepository.findById(String(r.referredUserId));
      joined.push({
        id: r._id,
        email: user?.email || 'unknown@referred.com',
        earnings: r.earnings,
        status: r.status,
        createdAt: (r as any).createdAt,
      });
    }
    return joined;
  }

  // AUDIT LOGS
  async getAuditLogs(userId: string) {
    return this.logRepository.find({ userId: new Types.ObjectId(userId) }, { sort: { createdAt: -1 } });
  }

  // TICKETS & HELP
  async getTickets(userId: string) {
    return this.ticketRepository.find({ userId: new Types.ObjectId(userId) }, { sort: { createdAt: -1 } });
  }

  async createTicket(userId: string, dto: any) {
    const ticket = await this.ticketRepository.create({
      userId: new Types.ObjectId(userId),
      subject: dto.subject,
      status: 'Open',
      priority: dto.priority || 'Medium',
      messages: [
        {
          senderId: new Types.ObjectId(userId),
          message: dto.message,
          sentAt: new Date(),
        },
      ],
    });
    await this.logActivity(userId, 'Audit', 'Ticket Raised', `Raised support ticket: ${dto.subject}`);
    return ticket;
  }

  // GDPR: EXPORT
  async exportData(userId: string) {
    const profile = await this.getProfile(userId);
    const addresses = await this.getAddresses(userId);
    const orders = await this.orderRepository.find({ userId: new Types.ObjectId(userId) });
    const tickets = await this.getTickets(userId);
    const payments = await this.getPaymentMethods(userId);
    const logs = await this.getAuditLogs(userId);

    await this.logActivity(userId, 'Security', 'GDPR Export Triggered', 'User requested full GDPR data portability export');

    return {
      exportedAt: new Date(),
      profile,
      addresses,
      orders,
      tickets,
      payments,
      logs,
    };
  }

  // GDPR: SOFT DELETE / DELETION REQUEST
  async requestDeletion(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    user.accountStatus = 'Pending Deletion';
    await user.save();
    await this.logActivity(userId, 'Security', 'Deletion Request Submitted', 'GDPR right to be forgotten requested');
    return { success: true, message: 'Account scheduled for deletion' };
  }
}
