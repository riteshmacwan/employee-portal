import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanyDocument } from 'src/profile/company/entities/company.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel('company')
    private readonly companyModel: Model<CompanyDocument>,
    private jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET,
    });
  }

  async verifyToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET,
      });

      return payload;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async validate(payload: any) {
    const { id, role } = payload;

    let data = undefined;
    if (role === 'company') {
      data = await this.companyModel.findById(id);
    }

    // const user = await this.userModel.findById(id);
    if (!data) {
      throw new UnauthorizedException(
        'You do not have permission to access this route.',
      );
    }

    return data;
  }
}
