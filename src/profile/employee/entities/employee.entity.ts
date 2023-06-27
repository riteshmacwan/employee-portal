import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Type } from 'class-transformer';
import { Document, Types } from 'mongoose';
import { Company } from 'src/profile/company/entities/company.entity';

export type EmployeeDocument = Employee & Document;

@Schema({ timestamps: true })
export class Employee {
  @Prop()
  readonly name: string;

  @Prop({ unique: [true, 'Duplicate email entered'] })
  readonly email: string;

  @Prop({ type: Types.ObjectId, ref: Company })
  readonly company_id: Types.ObjectId;

  @Exclude()
  @Prop()
  password: string;

  @Prop({ default: false })
  isVerified: boolean;

  constructor(partial: Partial<EmployeeDocument>) {
    Object.assign(this, partial);
  }
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
