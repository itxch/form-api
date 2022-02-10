import { Module } from '@nestjs/common';
import { FormDefinitionsService } from './form-definitions.service';
import { FormDefinitionsController } from './form-definitions.controller';

@Module({
  controllers: [FormDefinitionsController],
  providers: [FormDefinitionsService],
})
export class FormDefinitionsModule {}
