import {
  ArrayNotEmpty,
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FirestoreCollectionProviders } from '../../firestore/firestore.providers';

export enum FormType {
  string,
  textarea,
  radios,
  submit,
  date,
}

class QuestionOptions {
  @IsString()
  @IsDefined()
  name: string;

  @IsString()
  @IsDefined()
  value: string;
}

class ValidationOptions {
  @IsBoolean()
  @IsDefined()
  required: boolean;

  @IsNumber()
  @IsOptional()
  maxLength?: number;

  @IsString()
  @IsOptional()
  pattern?: string;

  @IsString()
  @IsOptional()
  validationMessage?: string;
}

class Fields {
  @IsDefined()
  @IsString()
  key: string;

  @IsDefined()
  @IsEnum(FormType)
  type: FormType;

  @IsDefined()
  @IsString()
  title: string;

  @IsDefined()
  @IsString()
  placeholder: string;

  @IsOptional()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => QuestionOptions)
  options?: QuestionOptions[];

  @IsDefined()
  @ValidateNested()
  @Type(() => ValidationOptions)
  validation: ValidationOptions;
}

export class FormDefinition {
  static collectionName: FirestoreCollectionProviders = 'form-definitions';

  @IsDefined()
  @IsString()
  formName: string;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Fields)
  fields: Fields[];
}
