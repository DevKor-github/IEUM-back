import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import axios, { AxiosError } from 'axios';
import { throwIeumException } from 'src/common/utils/exception.util';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  async getAndUploadFromUri(photoUri: string) {
    try {
      // 이미지 다운로드
      const response = await axios.get(photoUri, {
        responseType: 'arraybuffer',
      });
      // S3에 업로드
      const uploadResult = await this.s3
        .upload({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: uuid(),
          Body: response.data,
          ContentType: response.headers['content-type'],
        })
        .promise();

      return uploadResult.Location;
    } catch (error) {
      if (error instanceof AxiosError) {
        throwIeumException('IMAGE_DOWNLOAD_FAILED');
      }
      console.error(error);
      throwIeumException('AWS_S3_INTERNAL_ERROR');
    }
  }

  async uploadPlaceImage(placeImage: Express.Multer.File) {
    if (!placeImage || !placeImage.originalname) {
      throwIeumException('INVALID_IMAGE_FILE');
    }

    const lastDotIndex = placeImage.originalname.lastIndexOf('.');
    const fileExtension = placeImage.originalname.slice(lastDotIndex);
    const filename = `${uuid()}${fileExtension}`;

    await this.s3
      .putObject(
        {
          Key: `places/${filename}`,
          Body: placeImage.buffer,
          Bucket: process.env.S3_BUCKET_NAME,
          ContentType: placeImage.mimetype,
        },
        (err) => {
          if (err) {
            throwIeumException('AWS_S3_INTERNAL_ERROR');
          }
        },
      )
      .promise();

    return `${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/places/${filename}`;
  }
}
