import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { FormDefinitionsService } from './form-definitions.service';
import { FormDefinition } from './dto/form-definition.dto';
import { Response } from 'express';

@Controller('form-definitions')
export class FormDefinitionsController {
  constructor(
    private readonly formDefinitionsService: FormDefinitionsService,
  ) {}

  @Post()
  async create(
    @Res() res: Response,
    @Body() createFormDefinition: FormDefinition,
  ) {
    const response = await this.formDefinitionsService.create(
      createFormDefinition,
    );
    if (typeof response === 'string') {
      return res.status(405).send(response);
    }

    return res.status(200).json(response);
  }

  @Get(':formName')
  async findOne(@Res() res: Response, @Param('formName') formName: string) {
    if (typeof formName !== 'string') {
      return res.status(400).send('form name should be a string');
    }
    const response = await this.formDefinitionsService.findOne(formName);

    if (typeof response === 'string') {
      return res.status(404).send(response);
    }

    return res.status(200).json(response);
  }
}
