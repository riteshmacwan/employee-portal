import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CompanySignUpDto } from './dto/company-signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('company/signup')
  signup(@Body() companySignUpDto: CompanySignUpDto) {
    return this.authService.signup(companySignUpDto);
  }
  @Post('company/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
