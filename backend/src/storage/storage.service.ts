import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  ObjectCannedACL,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { nanoid } from 'nanoid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private s3: S3Client;
  constructor() {
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: process.env.BUCKET_STORAGE_KEY,
        secretAccessKey: process.env.BUCKET_STORAGE_SECRET,
      },
      endpoint: process.env.BUCKET_STORGE_ENDPOINT,
      region: process.env.BUCKET_STORAGE_REGION ?? 'sgp1',
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    settings?: {
      bucketName?: string;
      acl?: ObjectCannedACL;
      mimetype?: string;
      overrideName?: string;
      randomName?: boolean;
      addTimestampOnName?: boolean;
    },
  ) {
    const bucketName =
      settings.bucketName ??
      process.env.BUCKET_STORAGE_NAME ??
      'nestjs-backend-bucket-0';
    let fileName = settings.overrideName ?? file.originalname;

    if (settings.randomName) {
      fileName = `${nanoid(16)}`;
    }

    if (settings.addTimestampOnName) {
      fileName = `${Date.now()}-${fileName}`;
    }

    const upload = new Upload({
      client: this.s3,
      params: {
        Bucket: bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: settings.acl ?? 'public-read',
      },
    });

    return upload.done();
  }

  async getFileSignedUrl(
    fileName: string,
    settings?: { bucketName?: string; expiresIn?: number },
  ) {
    try {
      const bucketName =
        settings?.bucketName ??
        process.env.BUCKET_STORAGE_NAME ??
        'nestjs-backend-bucket-0';

      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: fileName,
      });

      const expiresIn = settings?.expiresIn ?? 3600;
      return await getSignedUrl(this.s3, command, { expiresIn });
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw error;
    }
  }

  async searchFile(fileName: string, settings?: { bucketName?: string }) {
    try {
      const bucketName =
        settings?.bucketName ??
        process.env.BUCKET_STORAGE_NAME ??
        'nestjs-backend-bucket-0';

      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: fileName,
      });

      const response = await this.s3.send(command);
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deleteFile(
    fileName: string,
    settings?: { bucketName?: string; throwError?: boolean },
  ) {
    try {
      const bucketName =
        settings?.bucketName ??
        process.env.BUCKET_STORAGE_NAME ??
        'nestjs-backend-bucket-0';

      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: fileName,
      });

      await this.s3.send(command);

      return true;
    } catch (error) {
      if (settings?.throwError === false) {
        console.log(error);
        return false;
      }

      throw error;
    }
  }
}
