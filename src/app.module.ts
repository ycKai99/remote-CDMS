import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StorageController } from './services/storage.service';
import { HttpModule } from '@nestjs/axios';

@Module({ 
  imports:[MulterModule,HttpModule],
  controllers: [AppController],
  providers: [AppService, StorageController],
})
export class AppModule {}

MulterModule.register({
  dest: './upload',
}); 
