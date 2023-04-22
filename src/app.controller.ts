import {
  All,
  Body,
  Controller,
  Get,
  ParseFilePipeBuilder,
  Post, 
  Req,
  Res, 
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
import { dataStorageInterface, dataStorageInterfaceRead, dataStorageInterfaceWrite } from './interfaces/data.storage';
import fs = require('graceful-fs')
import jade = require('jade')
import { HttpService } from '@nestjs/axios';
import { Response } from 'express';
const upload = multer({ dest: 'uploads/' })
const { v4: uuidv4 } = require('uuid');

let lastUpload={};

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly http: HttpService,
  ) {}

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
  async dataOperation(@Body() body) {
    let postBody: dataStorageInterface = body;
    return await this.appService.dataOperation(postBody);
  }
  
  res_render(jadefile: any, res: any, jadeargument: any) {
    // Compile a function
    let data = fs.readFileSync('views/' + jadefile + '.jade', {
        encoding: 'utf8',
    });
    let renderer = jade.compile(data);
    // Render the function
    let html = renderer({ jadeargument }); 
    return html;
  }

  @All('uploadfilemanagement')
  getUploadFileManagement(@Req() req,@Res() res) { 
    try{
      let jadeargument = {}; 
      let req_body ={};

      if( !req.body.filename ){}
      else{ lastUpload = req.body;}
 
      if(req.body['filedata'])
      { 
        let dataString = req.body['filedata'].split(',')[1]; 

        let mimeStr = req.body['filedata'].split(',')[0].split(':')[1].split(';')[0]; 

        req.body['filedata'] = dataString;
      }

      if(req.body['filename'])
      {
        // Append uuid in front
        req_body = { 'uuid': uuidv4(), ...req.body }
        this.writeData("genericFileData",req_body)
      }
 
      // Update display
      jadeargument['lastUpload'] = JSON.stringify(req_body,null,4);
 
      return res.send(this.res_render('uploadfilemanagement',res,jadeargument));  
    }
    catch(err)
    {
      console.log(err.message)
    }
  }
  
  @All('downloadfilemanagement')
  async getDownloadFileManagement(@Req() req,@Res() res:Response) {  
    try{
      console.log(JSON.stringify(req.body,null,4));
      let readData:string = "";
      let downloadData:any = {};
      let jadeargument = {}; 

      if( !req.body.filename ){}
      else{ lastUpload = req.body;}
  
      jadeargument['readData'] = [];    
      if(req)
      {
        readData = await this.readData("genericFileData","");
        jadeargument['readData'] = JSON.stringify(JSON.parse(readData),null,4);
      }

      if(req.body)
      {
        if(req.body.uuid)
        {
          downloadData = JSON.parse(await this.readData("genericFileData",req.body.uuid)); 
        }
      } 
      // handle array data
      if(downloadData[0])
      {
        downloadData= downloadData[0];
      }
  
      if(downloadData['filename'])
      {
        let downloadFileData:{
            uuid: string,
            filename: string,
            filetype: string,
            filesize: string,
            lastModified: string,
            filedata:string,
        } = downloadData;
        res.set('Content-disposition', `attachment; filename=${downloadFileData.filename}`);

        let downloadFileData_filedata = downloadFileData.filedata
        
        // Assume data is stored in base 64
        let fileBuffer = Buffer.from( downloadFileData_filedata, 'base64' );  
        return res.send(fileBuffer);
      }
      else
      { 
        return res.send(this.res_render('downloadfilemanagement',res,jadeargument)); 
      }
    }
    catch(err)
    {
      console.log(err.message);
    } 
  }

  
    /**
     * @param entityname string
     * @param entityUUID optional, used when read image
     * @description Check storage type, and pass data to readExec(entityname, entityUUID)
     */
    public async readData(entityname: string, entityUUID?: any): Promise<string> {
        
      let operationData: dataStorageInterfaceRead = {
          operation: "read",
          entityName: entityname,
          uuid: entityUUID
      }

      let responseMessage = (await this.http.axiosRef.post('http://localhost:'+process.env.PORT_SERVER+'/data', operationData)).data;
      return JSON.stringify(responseMessage);
  }

  /**
   * @param entityname string
   * @param data data
   * @description Check storage type, and pass data to writeExec(entityname, data)
   */
  public async writeData(entityname: string, payloadData: any): Promise<string>  {
      
      let operationData: dataStorageInterfaceWrite = {
          operation: "write",
          entityName: entityname,
          uuid: payloadData.uuid,
          data: JSON.stringify(payloadData)
      }
      let responseMessage = (await this.http.axiosRef.post('http://localhost:'+process.env.PORT_SERVER+'/data', operationData)).data;
      return JSON.stringify(responseMessage);
  }
} 