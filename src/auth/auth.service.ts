import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { CompanySignUpDto } from './dto/company-signup.dto';
import { CompanyService } from 'src/profile/company/company.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => CompanyService))
    private companyService: CompanyService,
    private jwtService: JwtService,
  ) {}

  async signup(companySignUpDto: CompanySignUpDto) {
    const company = await this.companyService.create(companySignUpDto);
    if (!company) {
      throw new BadRequestException();
    }
    const token = this.jwtService.sign({
      id: company._id,
      role: 'company',
    });
    return { token };
  }

  async login(loginDto: LoginDto) {
    const { email, password, role } = loginDto;
    let data = undefined;

    if (role === 'company') {
      data = await this.companyService.findByEmail(email);
    }

    if (!data) {
      throw new UnauthorizedException();
    }
    const isPassMatch = await bcrypt.compare(password, data.password);
    if (!isPassMatch) {
      throw new UnauthorizedException();
    }
    const token = this.jwtService.sign({
      id: data._id,
      role: role,
    });
    return { token };
  }
}
