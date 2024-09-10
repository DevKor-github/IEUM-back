import { Injectable } from '@nestjs/common';
import { PlaceImage } from 'src/place/entities/place-image.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PlaceImageRepository extends Repository<PlaceImage> {
  constructor(private readonly dataSource: DataSource) {
    super(PlaceImage, dataSource.createEntityManager());
  }

  async createPlaceImage(
    placeId: number,
    imageUrl: string,
  ): Promise<PlaceImage> {
    const placeImage = new PlaceImage();
    placeImage.placeId = placeId;
    placeImage.url = imageUrl;

    return await this.save(placeImage);
  }

  async createPlaceImageByGoogle(
    placeId: number,
    uploadedImageUrl: string,
    authorName?: string,
    authorUri?: string,
  ) {
    const placeImage = new PlaceImage();
    placeImage.placeId = placeId;
    placeImage.url = uploadedImageUrl;
    placeImage.authorName = authorName;
    placeImage.authorUri = authorUri;

    return await this.save(placeImage);
  }

  async getPlaceImagesByPlaceId(placeId: number): Promise<PlaceImage[]> {
    return await this.createQueryBuilder('placeImage')
      .where('placeImage.placeId = :placeId', { placeId })
      .getMany();
  }
}
