import { FormDefinition } from '../form-definitions/dto/form-definition.dto';

export type FirestoreCollectionProviders =
  | 'form-definitions'
  | 'form-submissions';

export const FirestoreDatabaseProvider = 'firestoredb';
export const FirestoreOptionsProvider = 'firestoreOptions';
export const FirestoreCollectionProviders: FirestoreCollectionProviders[] = [
  FormDefinition.collectionName,
];
