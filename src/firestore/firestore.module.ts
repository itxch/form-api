import { Module, DynamicModule } from '@nestjs/common';
import { initializeApp, FirebaseOptions } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  collection,
  connectFirestoreEmulator,
} from 'firebase/firestore';

import {
  FirestoreDatabaseProvider,
  FirestoreOptionsProvider,
  FirestoreCollectionProviders,
} from './firestore.providers';

type FirestoreModuleOptions = {
  imports: any[];
  useFactory: (...args: any[]) => FirebaseOptions;
  inject: any[];
};

@Module({})
export class FirestoreModule {
  static forRoot(options: FirestoreModuleOptions): DynamicModule {
    const optionsProvider = {
      provide: FirestoreOptionsProvider,
      useFactory: options.useFactory,
      inject: options.inject,
    };

    const dbProvider = {
      provide: FirestoreDatabaseProvider,
      useFactory: (config: FirebaseOptions) =>
        getFirestore(initializeApp(config)),
      inject: [FirestoreOptionsProvider],
    };
    const collectionProviders = FirestoreCollectionProviders.map(
      (providerName) => ({
        provide: providerName,
        useFactory: (db: Firestore) => {
          if (process.env.NODE_ENV === 'dev') {
            connectFirestoreEmulator(db, 'localhost', 3003);
          }
          return collection(db, providerName);
        },
        inject: [FirestoreDatabaseProvider],
      }),
    );
    return {
      global: true,
      module: FirestoreModule,
      imports: options.imports,
      providers: [optionsProvider, dbProvider, ...collectionProviders],
      exports: [dbProvider, ...collectionProviders],
    };
  }
}
