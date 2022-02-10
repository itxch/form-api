import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { FormDefinition, FormType } from '../form-definition.dto';
import { formData as correctData } from '../../__tests__/utils';

describe('Schema Validation', () => {
  const target: ValidationPipe = new ValidationPipe({
    whitelist: true,
  });
  const metadata: ArgumentMetadata = {
    type: 'body',
    metatype: FormDefinition,
  };

  it('Should pass as data meets schema requirements', async () => {
    await expect(
      target.transform(<FormDefinition>correctData, metadata),
    ).resolves.toEqual(correctData);
  });

  it('Should pass without optional "options" property', async () => {
    const data = {
      formName: 'Pool',
      fields: [
        {
          key: 'body',
          type: FormType.textarea,
          validation: {
            maxLength: 250,
            required: true,
            validationMessage: 'Personal message is required!',
          },
          placeholder: 'Compose message...',
          title: 'Your Personal Message to Suppliers',
        },
      ],
    };
    await expect(
      target.transform(<FormDefinition>data, metadata),
    ).resolves.not.toEqual(correctData);
  });

  it('Should fail is required option is empty', async () => {
    const data = {
      formName: 'Pool',
      fields: [
        {
          key: 'body',
          type: FormType.textarea,
          validation: {
            maxLength: 250,
            required: true,
            validationMessage: 'Personal message is required!',
          },
          options: {},
          placeholder: 'Compose message...',
          title: 'Your Personal Message to Suppliers',
        },
      ],
    };
    await target.transform(<FormDefinition>data, metadata).catch((err) => {
      expect(err.getResponse().message).toEqual([
        'fields.0.options.name should not be null or undefined',
        'fields.0.options.name must be a string',
        'fields.0.options.value should not be null or undefined',
        'fields.0.options.value must be a string',
        'fields.0.options should not be empty',
      ]);
    });
  });

  it('Should fail validation as data is empty', async () => {
    const data = {};
    await target.transform(<FormDefinition>data, metadata).catch((err) => {
      expect(err.getResponse().message).toEqual([
        'formName should not be null or undefined',
        'formName must be a string',
        'fields should not be empty',
      ]);
    });
  });

  it('Should fail validation as data does not have required property', async () => {
    const data = { ...correctData };
    delete data.fields[0].validation.required;
    await target.transform(<FormDefinition>data, metadata).catch((err) => {
      expect(err.getResponse().message).toEqual([
        'fields.0.validation.required should not be null or undefined',
        'fields.0.validation.required must be a boolean value',
      ]);
    });
  });
});
