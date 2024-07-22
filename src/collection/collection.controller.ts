import { Body, Controller, Get, ParseArrayPipe, Post } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateCollectionReqDto } from './dtos/create-collection-req.dto';

@ApiTags('collections')
@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post('create')
  async createCollections(
    @Body(new ParseArrayPipe({ items: CreateCollectionReqDto }))
    body: CreateCollectionReqDto[],
  ) {
    return await this.collectionService.createCollections(body);
  }
}
