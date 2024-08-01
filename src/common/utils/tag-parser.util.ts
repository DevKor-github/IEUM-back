import { PlaceTag } from 'src/entities/place-tag.entity';
import { TagType } from '../enums/tag-type.enum';

export function tagParser(placeTags: PlaceTag[]): {
  locationTags: string[];
  categoryTags: string[];
} {
  const { locationTags, categoryTags } = placeTags.reduce(
    (acc, placeTag) => {
      if (placeTag.tag.type === TagType.Location) {
        acc.locationTags.push(placeTag.tag.tagName);
      } else if (placeTag.tag.type === TagType.Category) {
        acc.categoryTags.push(placeTag.tag.tagName);
      }
      return acc;
    },
    { locationTags: [], categoryTags: [] },
  );

  return { locationTags, categoryTags };
}
