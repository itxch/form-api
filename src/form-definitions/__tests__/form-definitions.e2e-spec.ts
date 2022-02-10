import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { formData } from './utils';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import {
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { FormDefinitionsController } from '../form-definitions.controller';
import { FormDefinitionsService } from '../form-definitions.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
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
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [FormDefinitionsController],
      providers: [
        FormDefinitionsService,
        {
          provide: 'form-definitions',
          useFactory: () => collection(db, '/form-definitions'),
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
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

  describe('/form-definitions', () => {
    it('POST - new item, should create item in data base and return it', async () => {
      return request(app.getHttpServer())
        .post('/form-definitions')
        .send(formData)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(async (response) => {
          expect(response.body).toEqual(formData);
          const formSnapAfterRequest = await getDoc(
            doc(collection(db, '/form-definitions'), formData.formName),
          );
          expect(formSnapAfterRequest.data()).toEqual(formData);
        });
    });
    it('POST - existing item, should return correct message and not modify', async () => {
      const formRef = doc(
        collection(db, '/form-definitions'),
        formData.formName,
      );
      await setDoc(formRef, formData);
      const formSnapBeforeRequest = await getDoc(formRef);

      return request(app.getHttpServer())
        .post('/form-definitions')
        .send(formData)
        .expect(405)
        .expect('Content-Type', /text\/html/)
        .then(async (response) => {
          expect(response.text).toEqual(
            `A definition for ${formData.formName} already exists, to update use the PUSH method`,
          );
          const formSnapAfterRequest = await getDoc(formRef);
          expect(formSnapBeforeRequest.data()).toEqual(
            formSnapAfterRequest.data(),
          );
        });
    });
    it('GET - existing item, should return the correct object', async () => {
      const formRef = doc(
        collection(db, '/form-definitions'),
        formData.formName,
      );
      await setDoc(formRef, formData);
      const formSnapBeforeRequest = await getDoc(formRef);

      return request(app.getHttpServer())
        .get(`/form-definitions/${formData.formName}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(async (response) => {
          expect(response.body).toEqual(formSnapBeforeRequest.data());
        });
    });

    it('GET - non existent item, should return error', async () => {
      return request(app.getHttpServer())
        .get(`/form-definitions/${formData.formName}`)
        .expect(404)
        .expect('Content-Type', /text\/html/)
        .then(async (response) => {
          expect(response.text).toEqual(
            `${formData.formName} does not exist, to create use the POST method at the /form-definitions/ endpoint`,
          );
        });
    });
  });
});
