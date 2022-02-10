import { Test, TestingModule } from '@nestjs/testing';
import {
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { FormDefinitionsService } from '../form-definitions.service';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { formData } from './utils';

describe('FormDefinitionsService', () => {
  let formDefinitionsService: FormDefinitionsService;
  let testEnv: RulesTestEnvironment;
  let db;

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'demo-skilled-orbit-340816',
      firestore: {
        host: 'localhost',
        port: 3010,
      },
    });
    db = testEnv.authenticatedContext('hamza').firestore();
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormDefinitionsService,
        {
          provide: 'form-definitions',
          useFactory: () => collection(db, '/form-definitions'),
        },
      ],
    }).compile();

    formDefinitionsService = module.get<FormDefinitionsService>(
      FormDefinitionsService,
    );
  });

  afterEach(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'demo-skilled-orbit-340816',
      firestore: {
        host: 'localhost',
        port: 3010,
      },
    });
    await testEnv.clearFirestore();
  });

  it('should be defined', async () => {
    expect(formDefinitionsService).toBeDefined();
  });

  describe('Create', () => {
    it('Should create a new item if it does not exist in db', async () => {
      await expect(formDefinitionsService.create(formData)).resolves.toEqual(
        formData,
      );
    });

    it('Should not update already existing item', async () => {
      await setDoc(
        doc(collection(db, '/form-definitions'), formData.formName),
        formData,
      );
      await expect(formDefinitionsService.create(formData)).resolves.toEqual(
        `A definition for ${formData.formName} already exists, to update use the PUSH method`,
      );
    });
  });

  describe('Find One', () => {
    it('Should return item that exists in DB', async () => {
      const formRef = doc(
        collection(db, '/form-definitions'),
        formData.formName,
      );
      await setDoc(formRef, formData);
      const formSnap = await getDoc(formRef);
      const formDataFromDB = formSnap.data();

      await expect(
        formDefinitionsService.findOne(formData.formName),
      ).resolves.toEqual(formData);

      await expect(
        formDefinitionsService.findOne(formData.formName),
      ).resolves.toEqual(formDataFromDB);
    });

    it('Should return an error message if the item does not exist in DB', async () => {
      await expect(
        formDefinitionsService.findOne(formData.formName),
      ).resolves.toEqual(
        `${formData.formName} does not exist, to create use the POST method at the /form-definitions/ endpoint`,
      );
    });
  });
});
