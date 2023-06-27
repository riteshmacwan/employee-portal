import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CompanyModule } from '../profile/company/company.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanySchema } from 'src/profile/company/entities/company.entity';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{ name: 'company', schema: CompanySchema }]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('EXPIRE'),
          },
        };
      },
    }),
    forwardRef(() => CompanyModule),
  ],
  controllers: [AuthController],
  providers: [
    { provide: APP_GUARD, useClass: RolesGuard },
    JwtStrategy,
    AuthService,
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
