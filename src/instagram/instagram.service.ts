import { InstaGuestFolderPlaceRepository } from './../repositories/insta-guest-folder-place.repository';
import { InstaCollectionReqQueryDto } from './dtos/insta-collection-req-query.dto';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InstaGuestUserRepository } from '../repositories/insta-guest-user.repository';
import { InstaGuestCollectionRepository } from 'src/repositories/insta-guest-collection.repository';
import { InstaGuestCollection } from 'src/entities/insta-guest-collection.entity';
import { CrawledInstagramDto } from './dtos/crawled-instagram-dto';
import { PlaceService } from 'src/place/place.service';
import {
  InstaCollectionMarkerDto,
  InstaCollectionMarkersListDto,
} from './dtos/insta-collection-marker.dto';
import { CATEGORIES_MAPPING } from 'src/common/constants/categories-mapping.constant';
import { CATEGORIES_TRANSLATED } from 'src/common/constants/categories-translated.constant';
import {
  InstaCollectionDto,
  InstaCollectionsListDto,
} from './dtos/insta-collection.dto';
import { InstaCollectionDetailDto } from './dtos/insta-collection-detail.dto';
import { InstaGuestFolderRepository } from 'src/repositories/insta-guest-folder.repository';
import { FolderService } from 'src/folder/folder.service';
import {
  NotFoundInstaCollectionException,
  NotValidInstaGuestUserException,
} from 'src/common/exceptions/insta.exception';
import { InstaGuestUserCollectionRepository } from 'src/repositories/insta-guest-user-collection.repository';
import { InstaGuestCollectionPlaceRepository } from 'src/repositories/insta-guest-collection-place.repository';

@Injectable()
export class InstagramService {
  constructor(
    private readonly placeService: PlaceService,
    private readonly folderService: FolderService,
    private readonly instaGuestUserRepository: InstaGuestUserRepository,
    private readonly instaGuestCollectionRepository: InstaGuestCollectionRepository,
    private readonly instaGuestFolderRepository: InstaGuestFolderRepository,
    private readonly instaGuestFolderPlaceRepository: InstaGuestFolderPlaceRepository,
    private readonly instaGuestUserCollectionRepository: InstaGuestUserCollectionRepository,
    private readonly instaGuestCollectionPlaceRepository: InstaGuestCollectionPlaceRepository,
  ) {}

  async test(instaId: string) {
    const instaGuestUser = await this.instaGuestUserRepository.findOne({
      where: { instaId: instaId },
      relations: ['user'],
    });
    return instaGuestUser.user ? instaGuestUser.user : 'no user';
  }

  async crawlToDB(
    crawledInstagramDto: CrawledInstagramDto[],
  ): Promise<InstaGuestCollection[]> {
    const createdInstaGuestCollection = [];

    for (const dto of crawledInstagramDto) {
      try {
        const placeInfo = await this.placeService.createPlaceByGooglePlaceId(
          dto.googlePlaceId,
        );
        const instaGuestUser =
          await this.instaGuestUserRepository.createInstaGuestUser({
            instaId: dto.instagramId,
          });
        const instaGuestFolder =
          await this.instaGuestFolderRepository.createInstaGuestFolder(
            instaGuestUser,
          );
        const createdFolderPlace =
          await this.instaGuestFolderPlaceRepository.createInstaGuestFolderPlace(
            placeInfo.id,
            instaGuestFolder.id,
          );
        if (createdFolderPlace.status === 'created' && instaGuestUser.user) {
          await this.folderService.appendPlaceToInstaFolder(
            instaGuestUser.user.id,
            placeInfo.id,
          );
        }
        const instaGuestCollection =
          await this.instaGuestCollectionRepository.createInstaGuestCollection({
            link: dto.instagramLink,
            content: dto.instagramDescription,
            embeddedTag: dto.embeddedTag,
          });
        await this.instaGuestUserCollectionRepository.createInstaGuestUserCollection(
          instaGuestUser.id,
          instaGuestCollection.id,
        );
        await this.instaGuestCollectionPlaceRepository.createInstaGuestCollectionPlace(
          instaGuestCollection.id,
          placeInfo.id,
        );
        if (instaGuestCollection) {
          createdInstaGuestCollection.push(instaGuestCollection);
        }
      } catch (error) {
        throw new InternalServerErrorException(
          'crawled 데이터를 DB에 적재하는 과정에서 오류가 발생했습니다.',
          error.stack,
        );
      }
    }

    return createdInstaGuestCollection;
  }

  async getMarkers(instaId: string): Promise<InstaCollectionMarkersListDto> {
    const instaGuestUser = await this.instaGuestUserRepository.findOne({
      where: { instaId: instaId },
    });
    if (!instaGuestUser) {
      throw new NotValidInstaGuestUserException(
        '해당하는 인스타그램 사용자가 없습니다.',
      );
    }
    const rawMarkers = await this.instaGuestUserRepository.getMarkers(
      instaGuestUser.id,
    );
    const markersList = rawMarkers.map((rawMarker) => {
      return new InstaCollectionMarkerDto(
        rawMarker,
        this.determineRepresentativeCategory(rawMarker.primary_category),
      );
    });

    return new InstaCollectionMarkersListDto(markersList.length, markersList);
  }

  async getCollections(
    instaId: string,
    instaCollectionReqQueryDto: InstaCollectionReqQueryDto,
  ): Promise<InstaCollectionsListDto> {
    const instaGuestUser = await this.instaGuestUserRepository.findOne({
      where: { instaId: instaId },
    });
    if (!instaGuestUser) {
      throw new NotValidInstaGuestUserException(
        '해당하는 인스타그램 사용자가 없습니다.',
      );
    }
    const rawInstaCollections =
      await this.instaGuestCollectionRepository.getCollections(
        instaGuestUser.id,
        instaCollectionReqQueryDto.region,
        instaCollectionReqQueryDto.cursorId,
        instaCollectionReqQueryDto.placeId,
      );
    const collectionsList = rawInstaCollections.map((rawCollection) => {
      rawCollection.primary_category = this.translateCategoryName(
        rawCollection.primary_category,
      );
      return new InstaCollectionDto(rawCollection);
    });
    return new InstaCollectionsListDto(collectionsList);
  }

  async getCollectionDetail(
    instaId: string,
    instaGuestCollectionId: number,
  ): Promise<InstaCollectionDetailDto> {
    const instaGuestUser = await this.instaGuestUserRepository.findOne({
      where: { instaId: instaId },
    });
    if (!instaGuestUser) {
      throw new NotValidInstaGuestUserException(
        '해당하는 인스타그램 사용자가 없습니다.',
      );
    }
    const rawDetail =
      await this.instaGuestCollectionRepository.getCollectionDetail(
        instaGuestUser.id,
        instaGuestCollectionId,
      );
    if (!rawDetail) {
      throw new NotFoundInstaCollectionException('해당하는 컬렉션이 없습니다.');
    }
    rawDetail.primary_category = this.translateCategoryName(
      rawDetail.primary_category,
    );
    return new InstaCollectionDetailDto(rawDetail);
  }

  determineRepresentativeCategory(category: string): string {
    for (const [newCategory, oldCategories] of Object.entries(
      CATEGORIES_MAPPING,
    )) {
      if (oldCategories.includes(category)) {
        return newCategory;
      }
    }
    return 'Others';
  }

  translateCategoryName(category: string): string {
    if (CATEGORIES_TRANSLATED[category]) {
      return CATEGORIES_TRANSLATED[category];
    }
    return '기타';
  }
}
