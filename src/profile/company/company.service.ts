import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanyDocument } from './entities/company.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel('company')
    private readonly companyModel: Model<CompanyDocument>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const { name, email, password } = createCompanyDto;
    const hashedPass = await bcrypt.hash(password, 10);

    const company = await this.companyModel.create({
      name,
      email,
      password: hashedPass,
    });

    return company;
  }

  findAll() {
    return `This action returns all company`;
  }

  async findOne(id: string) {
    try {
      const company = await this.companyModel.findById({ _id: id });
      if (!company) {
        return {};
      }
      return company;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findByEmail(email: string) {
    try {
      const company = await this.companyModel.findOne({ email });

      return company;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    const updatedCompany = await this.companyModel.findByIdAndUpdate(
      id,
      updateCompanyDto,
      { new: true },
    );
    return updatedCompany;
  }

  async remove(id: string) {
    const deletedCompany = await this.companyModel.findByIdAndDelete(id);
    console.log(deletedCompany);
    return deletedCompany;
  }
}
