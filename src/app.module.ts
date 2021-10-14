import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DomainsModule } from './api/v1/domains/domains.module';
import { SharedModule } from './shared/shared.module';
import { DataInitService } from './dataInit.service';

@Module({
  imports: [
    SharedModule,
    DomainsModule,
    MongooseModule.forRoot('mongodb://localhost:27017/demo-domains'),
  ],
  controllers: [AppController],
  providers: [AppService, DataInitService],
})
export class AppModule {}
