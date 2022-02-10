import { FormDefinition, FormType } from '../dto/form-definition.dto';

export const formData: FormDefinition = {
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
      options: [
        {
          name: 'Inflatable',
          value: 'inflatable',
        },
        {
          name: 'Solid',
          value: 'solid',
        },
      ],
    },
  ],
};
