import { Injectable } from '@nestjs/common';
import { PlaceImage } from 'src/entities/place-image.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PlaceImageRepository extends Repository<PlaceImage> {
  private placeImageRepository: Repository<PlaceImage>;

  constructor(private readonly dataSource: DataSource) {
    super(PlaceImage, dataSource.createEntityManager());
  }

  async savePlaceImage(placeId: number, imageUrl: string): Promise<PlaceImage> {
    const placeImage = new PlaceImage();
    placeImage.placeId = placeId;
    placeImage.url = imageUrl;

    return await this.save(placeImage);
  }
}
