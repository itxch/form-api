import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FormDefinitionsModule } from './form-definitions/form-definitions.module';
import { FirestoreModule } from './firestore/firestore.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FirestoreModule.forRoot({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        projectId:
          process.env.NODE_ENV !== 'dev'
            ? configService.get<string>('PROJECT_ID')
            : `demo-${configService.get<string>('PROJECT_ID')}`,
        apiKey: configService.get<string>('API_KEY'),
        authDomain: configService.get<string>('AUTH_DOMAIN'),
        storageBucket: configService.get<string>('STORAGE_BUCKET'),
        messagingSenderId: configService.get<string>('MESSAGING_SENDER_ID'),
        appId: configService.get<string>('APP_ID'),
        measurementId: configService.get<string>('MEASUREMENT_ID'),
      }),
      inject: [ConfigService],
    }),
    FormDefinitionsModule,
  ],
})
export class AppModule {}
