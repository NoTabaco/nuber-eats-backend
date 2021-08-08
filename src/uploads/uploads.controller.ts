import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';

@Controller('uploads')
export class UploadsController {
  constructor(private configService: ConfigService) {}

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    AWS.config.update({
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_SECRET_KEY'),
      },
    });
    try {
      const objectName = `${Date.now() + file.originalname}`;
      // must be unique the bucket name
      await new AWS.S3()
        .putObject({
          Bucket: this.configService.get('AWS_BUCKET_NAME'),
          Body: file.buffer,
          Key: objectName,
          ACL: 'public-read',
        })
        .promise();
      const url = `https://${this.configService.get(
        'AWS_BUCKET_NAME',
      )}.s3.amazonaws.com/${objectName}`;
      return { url };
    } catch (error) {
      return null;
    }
  }
}
