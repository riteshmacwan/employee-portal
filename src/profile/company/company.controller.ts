import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Roles } from 'src/auth/guards/roles.decorator';
import { Role } from 'src/auth/guards/roles';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(AuthGuard())
  @Roles(Role.COMPANY)
  @Get('profile')
  findOne(@Req() req: Request) {
    return req['user'];
  }

  @UseGuards(AuthGuard())
  @Roles(Role.COMPANY)
  @Patch('profile/edit')
  update(@Req() req: Request, @Body() updateCompanyDto: UpdateCompanyDto) {
    const id = req['user']['_id'];
    return this.companyService.update(id, updateCompanyDto);
  }

  @UseGuards(AuthGuard())
  @Roles(Role.COMPANY)
  @Delete('profile/delete')
  remove(@Req() req: Request) {
    const id = req['user']['_id'];
    return this.companyService.remove(id);
  }
}
