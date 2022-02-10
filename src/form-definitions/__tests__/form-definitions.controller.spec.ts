import { Test } from '@nestjs/testing';
import { FormDefinitionsController } from '../form-definitions.controller';
import { FormDefinitionsService } from '../form-definitions.service';
import { createResponse } from 'node-mocks-http';
import { FormDefinition } from '../dto/form-definition.dto';
import { collection } from 'firebase/firestore';
import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { formData } from './utils';

describe('formDefinitionsController', () => {
  let formDefinitionsController: FormDefinitionsController;
  let formDefinitionsService: FormDefinitionsService;
  const res = createResponse();
  let db;

  beforeAll(async () => {
    const testEnv = await initializeTestEnvironment({
      projectId: 'demo-skilled-orbit-340816',
      firestore: {
        host: 'localhost',
        port: 3010,
      },
    });
    db = testEnv.authenticatedContext('hamza').firestore();
  });

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [FormDefinitionsController],
      providers: [
        FormDefinitionsService,
        {
          provide: 'form-definitions',
          useFactory: () => collection(db, '/form-definitions'),
        },
      ],
    }).compile();

    formDefinitionsController = moduleRef.get<FormDefinitionsController>(
      FormDefinitionsController,
    );
    formDefinitionsService = moduleRef.get<FormDefinitionsService>(
      FormDefinitionsService,
    );
  });

  it('should be defined', () => {
    expect(formDefinitionsController).toBeDefined();
    expect(formDefinitionsService).toBeDefined();
  });

  describe('POST Request - create', () => {
    it('Should return 200 code if FormDefinition is returned', async () => {
      jest
        .spyOn(formDefinitionsService, 'create')
        .mockImplementation(async (): Promise<FormDefinition> => formData);
      const response = await formDefinitionsController.create(res, formData);
      expect(response.statusCode).toEqual(200);
    });

    it('Should return 405 code if a string is returned', async () => {
      jest
        .spyOn(formDefinitionsService, 'create')
        .mockImplementation(
          async (): Promise<string> =>
            'Definition already exists, to update use the PUSH method',
        );
      const response = await formDefinitionsController.create(res, formData);
      expect(response.statusCode).toEqual(405);
    });
  });

  describe('GET Request - findOne', () => {
    it('Should return 200 code if FormDefinition is returned', async () => {
      jest
        .spyOn(formDefinitionsService, 'findOne')
        .mockImplementation(async (): Promise<FormDefinition> => formData);
      const response = await formDefinitionsController.findOne(
        res,
        formData.formName,
      );
      expect(response.statusCode).toEqual(200);
    });

    it('Should return 404 code if text is returned', async () => {
      jest
        .spyOn(formDefinitionsService, 'findOne')
        .mockImplementation(
          async (): Promise<string> =>
            `${formData.formName} does not exist, to create use the POST method at the /form-definitions/ endpoint`,
        );
      const response = await formDefinitionsController.findOne(
        res,
        formData.formName,
      );
      expect(response.statusCode).toEqual(404);
    });

    it('Should return 400 code if formName is not a string', async () => {
      const response = await formDefinitionsController.findOne(
        res,
        //We want to give it an incorrect type
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        123,
      );
      expect(response.statusCode).toEqual(400);
    });
  });
});
