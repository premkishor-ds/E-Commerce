import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function setupAdminJS(app: any) {
  try {
    // Use path-based imports with file:// scheme via pathToFileURL to bypass broken exports maps
    const nodeRequire = require;
    const path = nodeRequire('path');
    const { pathToFileURL } = nodeRequire('url');

    const adminJSPath = pathToFileURL(
      path.join(process.cwd(), 'node_modules/adminjs/index.js'),
    ).href;
    const mongoosePath = pathToFileURL(
      path.join(process.cwd(), 'node_modules/@adminjs/mongoose/lib/index.js'),
    ).href;
    const expressPath = pathToFileURL(
      path.join(process.cwd(), 'node_modules/@adminjs/express/lib/index.js'),
    ).href;
    const sessionPath = pathToFileURL(
      path.join(process.cwd(), 'node_modules/express-session/index.js'),
    ).href;

    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const dynamicImport = new Function('p', 'return import(p)');

    const [
      { default: AdminJS },
      AdminJSMongoose,
      { buildAuthenticatedRouter },
      session,
    ] = await Promise.all([
      dynamicImport(adminJSPath),
      dynamicImport(mongoosePath),
      dynamicImport(expressPath),
      dynamicImport(sessionPath),
    ]);

    // Register the Mongoose adapter
    AdminJS.registerAdapter({
      Resource: AdminJSMongoose.Resource,
      Database: AdminJSMongoose.Database,
    });

    // Retrieve registered models from NestJS global connection instead of standby mongoose module
    const { getConnectionToken } = await import('@nestjs/mongoose');
    const nestMongooseConnection = app.get(getConnectionToken());

    const getModel = (name: string) => {
      try {
        if (nestMongooseConnection.models[name])
          return nestMongooseConnection.models[name];
        // If not compiled yet, load the schema manually from schemas file
        const nodeRequire = require;
        const schemaPath = path.join(process.cwd(), 'dist/schemas/schemas.js');
        const schemas = nodeRequire(schemaPath);
        const schemaDef = schemas[name + 'Schema'];
        if (schemaDef) {
          // Schema constructor is what mongoose model compiles on
          return nestMongooseConnection.model(name, schemaDef);
        }
        return nestMongooseConnection.model(name);
      } catch (e: any) {
        console.error(`getModel error for ${name}:`, e.message);
        return null;
      }
    };

    const resources: any[] = [];
    const modelDefs = [
      { name: 'User', nav: 'Users & Auth' },
      { name: 'Product', nav: 'Catalog' },
      { name: 'Inventory', nav: 'Catalog' },
      { name: 'Order', nav: 'Sales' },
      { name: 'Coupon', nav: 'Sales' },
      { name: 'Ticket', nav: 'Support' },
      { name: 'Review', nav: 'Support' },
      { name: 'Vendor', nav: 'Vendors' },
      { name: 'Category', nav: 'Catalog' },
      { name: 'Brand', nav: 'Catalog' },
      { name: 'Payment', nav: 'Sales' },
      { name: 'Notification', nav: 'Users & Auth' },
    ];

    for (const def of modelDefs) {
      const m = getModel(def.name);
      if (m) resources.push({ resource: m, options: { navigation: def.nav } });
    }

    const adminJs = new AdminJS({
      rootPath: '/admin',
      resources,
      branding: {
        companyName: 'ApexStore Admin',
        logo: false,
        withMadeWithLove: false,
        theme: {
          colors: {
            primary100: '#4f46e5',
            primary80: '#6366f1',
            primary60: '#818cf8',
            primary40: '#a5b4fc',
            primary20: '#e0e7ff',
            accent: '#7c3aed',
            love: '#4f46e5',
            filterBg: '#18181b',
            defaultText: '#f4f4f5',
            lightText: '#a1a1aa',
            grey100: '#09090b',
            grey80: '#18181b',
            grey60: '#27272a',
            grey40: '#3f3f46',
            grey20: '#52525b',
          },
        },
      },
      locale: {
        language: 'en',
        translations: {
          en: {
            components: {
              Login: {
                welcomeHeader: 'Welcome to ApexStore Admin',
                welcomeMessage: 'Sign in to manage your e-commerce platform.',
              },
            },
          },
        },
      },
    });

    // Cookie-based session for AdminJS auth
    const sessionMiddleware = session.default({
      secret: 'apex-admin-secret-session-key-2024!',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
      name: 'apex-admin-sid',
    });

    // Build authenticated router using buildAuthenticatedRouter
    const express = nodeRequire('express');
    const customRouter = express.Router();
    const adminRouter = buildAuthenticatedRouter(
      adminJs,
      {
        authenticate: async (email: string, password: string) => {
          try {
            console.log(
              'Received auth request email:',
              email,
              'password:',
              password,
            );
            const UserModel = getModel('User');
            if (!UserModel) return null;
            const user = await UserModel.findOne({ email });
            console.log('Found user in DB:', user ? user.email : 'Not Found');
            if (!user) return null;
            // Allow access for admin-level roles (no password hashing check for simplicity — use your AuthService in prod)
            const adminRoles = ['Super Admin', 'Admin', 'Manager'];
            const isAdmin = user.roles?.some((r: string) =>
              adminRoles.includes(r),
            );
            if (!isAdmin) return null;
            // Check password — support both plaintext (dev) and bcrypt (prod)
            let passwordMatch = false;
            try {
              const bcrypt = await import('bcrypt');
              passwordMatch = await bcrypt.compare(
                password,
                user.passwordHash || user.password,
              );
            } catch {
              // bcrypt not available, fall back to plain comparison (dev only)
              passwordMatch = (user.passwordHash || user.password) === password;
            }
            if (!passwordMatch) return null;
            return { email: user.email, title: user.firstName || user.email };
          } catch (e: any) {
            console.error('Authentication Error Trace:', e);
            return null;
          }
        },
        cookieName: 'apex-admin-sid',
        cookiePassword: 'apex-admin-secret-session-key-2024!',
      } as any,
      customRouter,
      {
        secret: 'apex-admin-secret-session-key-2024!',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
        name: 'apex-admin-sid',
      },
    );

    // Mount on the raw Express app BEFORE NestJS global prefix
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.use('/admin', sessionMiddleware, adminRouter);

    console.log(`AdminJS panel available at: http://localhost:5001/admin`);
  } catch (err: any) {
    console.warn(`⚠️  AdminJS setup skipped: ${err.message}`);
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security Middlewares — disable CSP for AdminJS compatibility
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global prefixes and versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('Enterprise E-Commerce API')
    .setDescription(
      'Production-ready API for Multi-Vendor E-Commerce Platforms',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT Token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Setup AdminJS BEFORE app listens (so Express routes are bound in time)
  await setupAdminJS(app);

  const port = process.env.PORT || 5001;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}/api/v1`);
  console.log(
    `Swagger documentation is available at: http://localhost:${port}/api/docs`,
  );
  console.log(`AdminJS admin panel: http://localhost:${port}/admin`);
}
bootstrap();
