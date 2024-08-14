import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { AWSS3ErrorException } from 'src/common/exceptions/aws.exception';
import { BadRequestImageFileException } from 'src/common/exceptions/place.exception';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  async uploadPlaceImage(placeImage: Express.Multer.File) {
    console.log(placeImage);
    if (!placeImage || !placeImage.originalname) {
      throw new BadRequestImageFileException(
        '파일이 업로드 되지 않았거나, 파일명이 존재하지 않습니다.',
      );
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
            throw new AWSS3ErrorException(`${err}`);
          }
        },
      )
      .promise();

    return `${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/places/${filename}`;
  }
}
