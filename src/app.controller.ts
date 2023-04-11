import {
  Body,
  Controller,
  Get,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import express, { Express } from 'express';
import { AppService } from './app.service';
import { SampleDto } from './interfaces/sample.dto';
import * as multer from 'multer'
import { diskStorage } from 'multer'
import { extname } from 'path';
import { dataStorageInterface } from './interfaces/data.storage';
const upload = multer({ dest: 'uploads/' })

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  sayHello() {
    return this.appService.getHello();
  }
  
  // refer to https://stackoverflow.com/questions/49096068/upload-file-using-nestjs-and-multer
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads'  
    })
  }))
  @Post('file')
  uploadFile(
    @Body() body: SampleDto,
    @UploadedFile() file: Express.Multer.File,
  ) { 
    return {
      body,
      file: file,
    };
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('file/pass-validation')
  uploadFileAndPassValidation(
    @Body() body: SampleDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'json',
        })
        .build({
          fileIsRequired: false,
        }),
    )
    file?: Express.Multer.File,
  ) {
    return {
      body,
      file: file,
    };
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('file/fail-validation')
  uploadFileAndFailValidation(
    @Body() body: SampleDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpg',
        })
        .build(),
    )
    file: Express.Multer.File,
  ) {
    return {
      body,
      file: file.buffer.toString(),
    };
  }
  
  @Post('data')
  dataOperation(@Body() body) {
    let postBody: dataStorageInterface = body;
    return this.appService.dataOperation(postBody);
  }
  
}
 