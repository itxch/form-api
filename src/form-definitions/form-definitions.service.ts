import { Inject, Injectable } from '@nestjs/common';
import { FormDefinition } from './dto/form-definition.dto';
import { CollectionReference, doc, getDoc, setDoc } from 'firebase/firestore';

@Injectable()
export class FormDefinitionsService {
  constructor(
    @Inject(FormDefinition.collectionName)
    private formDefinitionsCollection: CollectionReference<FormDefinition>,
  ) {}

  async create(
    formDefinitionData: FormDefinition,
  ): Promise<FormDefinition | string> {
    const { formName } = formDefinitionData;
    const formRef = doc<FormDefinition>(
      this.formDefinitionsCollection,
      formName,
    );
    const formSnap = await getDoc<FormDefinition>(formRef);

    if (formSnap.exists()) {
      return `A definition for ${formName} already exists, to update use the PUSH method`;
    }

    try {
      await setDoc<FormDefinition>(formRef, formDefinitionData);
      const formSnap = await getDoc<FormDefinition>(formRef);
      return formSnap.data();
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }

  async findOne(formName: string): Promise<FormDefinition | string> {
    const formRef = doc<FormDefinition>(
      this.formDefinitionsCollection,
      formName,
    );
    const formSnap = await getDoc<FormDefinition>(formRef);

    if (formSnap.exists()) {
      return formSnap.data();
    }

    return `${formName} does not exist, to create use the POST method at the /form-definitions/ endpoint`;
  }
}
