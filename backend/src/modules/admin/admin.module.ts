import { Module } from '@nestjs/common';
import { AdminModule } from '@adminjs/nestjs';
import AdminJSMongoose from '@adminjs/mongoose';
import AdminJS from 'adminjs';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { SchemasModule } from '../../schemas/schemas.module';
import {
  User,
  Product,
  Order,
  Ticket,
  Review,
  Coupon,
  Vendor,
  Inventory,
  Log,
  PaymentAuditLog,
} from '../../schemas/schemas';
import { ChatSession, ChatSessionSchema } from '../agent/agent.schemas';

// Register Mongoose Adapter with AdminJS
AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

@Module({
  imports: [
    SchemasModule,
    MongooseModule.forFeature([
      { name: ChatSession.name, schema: ChatSessionSchema },
    ]),
    AdminModule.createAdminAsync({
      inject: [
        getModelToken(User.name),
        getModelToken(Product.name),
        getModelToken(Order.name),
        getModelToken(Ticket.name),
        getModelToken(Review.name),
        getModelToken(Coupon.name),
        getModelToken(Vendor.name),
        getModelToken(Inventory.name),
        getModelToken(Log.name),
        getModelToken(PaymentAuditLog.name),
        getModelToken(ChatSession.name),
      ],
      useFactory: (
        userModel: any,
        productModel: any,
        orderModel: any,
        ticketModel: any,
        reviewModel: any,
        couponModel: any,
        vendorModel: any,
        inventoryModel: any,
        logModel: any,
        paymentAuditLogModel: any,
        chatSessionModel: any,
      ) => ({
        adminJsOptions: {
          rootPath: '/admin',
          resources: [
            { resource: userModel, options: { navigation: 'Users & Auth' } },
            { resource: productModel, options: { navigation: 'Catalog' } },
            { resource: inventoryModel, options: { navigation: 'Catalog' } },
            { resource: orderModel, options: { navigation: 'Sales' } },
            { resource: couponModel, options: { navigation: 'Sales' } },
            { resource: ticketModel, options: { navigation: 'Support' } },
            { resource: reviewModel, options: { navigation: 'Support' } },
            { resource: vendorModel, options: { navigation: 'Vendors' } },
            { resource: logModel, options: { navigation: 'Logs & Audits' } },
            { resource: paymentAuditLogModel, options: { navigation: 'Logs & Audits' } },
            { resource: chatSessionModel, options: { navigation: 'Logs & Audits' } },
          ],
          branding: {
            companyName: 'ApexStore',
            theme: {
              colors: {
                primary100: '#4f46e5',
              },
            },
          },
        },
        auth: {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          authenticate: async (email: any, _password: any) => {
            const user = await userModel.findOne({ email });
            if (user) {
              const allowedRoles = [
                'Super Admin',
                'Admin',
                'Manager',
                'Customer Support',
                'Seller',
                'Vendor',
              ];
              const hasRole = user.roles.some((r: any) =>
                allowedRoles.includes(r),
              );
              if (hasRole) {
                // Return user object on success
                return { email: user.email, title: user.email };
              }
            }
            return null;
          },
          cookieName: 'adminjs-session',
          cookiePassword: 'supersecretcookiepasswordforadminjspanel123!',
        },
      }),
    }),
  ],
})
export class AppAdminModule {}
