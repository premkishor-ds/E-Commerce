import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Headers,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Payment Integrations (Stripe, Razorpay, Wallet, COD)')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('stripe/intent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create Stripe Payment Intent' })
  async createStripeIntent(
    @Request() req: any,
    @Body('orderId') orderId: string,
  ) {
    return this.paymentService.createStripePaymentIntent(orderId, req.user.id);
  }

  @Post('stripe/confirm')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Confirm Stripe Payment' })
  async confirmStripePayment(
    @Request() req: any,
    @Body('transactionId') transactionId: string,
  ) {
    return this.paymentService.confirmStripePayment(transactionId, req.user.id);
  }

  @Post('stripe/webhook')
  @ApiOperation({ summary: 'Stripe Webhook Handler' })
  async stripeWebhook(
    @Headers('stripe-signature') signature: string,
    @Body() payload: any,
  ) {
    return this.paymentService.verifyStripeWebhook(signature, payload);
  }

  @Post('razorpay/order')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create Razorpay Order' })
  async createRazorpayOrder(
    @Request() req: any,
    @Body('orderId') orderId: string,
  ) {
    return this.paymentService.createRazorpayOrder(orderId, req.user.id);
  }

  @Post('razorpay/verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Verify Razorpay Signature' })
  async verifyRazorpaySignature(
    @Request() req: any,
    @Body('orderId') orderId: string,
    @Body('paymentId') paymentId: string,
    @Body('signature') signature: string,
  ) {
    return this.paymentService.verifyRazorpaySignature(
      orderId,
      paymentId,
      signature,
      req.user.id,
    );
  }

  @Get('cod/eligibility/:orderId')
  @ApiOperation({ summary: 'Check COD eligibility' })
  async checkCodEligibility(@Param('orderId') orderId: string) {
    return this.paymentService.checkCodEligibility(orderId);
  }

  @Post('wallet/pay')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Process Wallet Payment' })
  async payWithWallet(
    @Request() req: any,
    @Body('orderId') orderId: string,
    @Body('amount') amount: number,
  ) {
    return this.paymentService.processWalletPayment(
      orderId,
      req.user.id,
      amount,
    );
  }

  @Post('hybrid/pay')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Process Hybrid (Wallet + Gateway) Payment' })
  async payHybrid(
    @Request() req: any,
    @Body('orderId') orderId: string,
    @Body('walletAmount') walletAmount: number,
    @Body('gatewayAmount') gatewayAmount: number,
    @Body('gatewayProvider') gatewayProvider: 'Stripe' | 'Razorpay',
  ) {
    return this.paymentService.processHybridPayment(
      orderId,
      req.user.id,
      walletAmount,
      gatewayAmount,
      gatewayProvider,
    );
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get payment transaction history' })
  async getPaymentHistory(@Request() req: any) {
    return this.paymentService.getPaymentHistory(req.user.id);
  }

  @Post('refund')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Refund order payment' })
  async refundPayment(
    @Request() req: any,
    @Body('orderId') orderId: string,
    @Body('amount') amount: number,
    @Body('reason') reason: string,
  ) {
    return this.paymentService.refundStripePayment(
      orderId,
      amount,
      reason,
      req.user.id,
    );
  }

  @Post('retry')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retry payment' })
  async retryPayment(
    @Request() req: any,
    @Body('orderId') orderId: string,
    @Body('provider') provider: string,
  ) {
    return this.paymentService.retryPayment(orderId, provider, req.user.id);
  }
}
