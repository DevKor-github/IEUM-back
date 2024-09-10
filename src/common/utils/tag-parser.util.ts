import { PlaceTag } from 'src/place/entities/place-tag.entity';
import { TagType } from '../enums/tag-type.enum';

export function tagParser(placeTags: PlaceTag[]): {
  locationTags: string[];
  categoryTags: string[];
  customTags: string[];
} {
  const { locationTags, categoryTags, customTags } = placeTags.reduce(
    (acc, placeTag) => {
      if (placeTag.tag.type === TagType.Location) {
        acc.locationTags.push(placeTag.tag.tagName);
      } else if (placeTag.tag.type === TagType.Category) {
        acc.categoryTags.push(placeTag.tag.tagName);
      } else if (placeTag.tag.type === TagType.Custom) {
        acc.customTags.push(placeTag.tag.tagName);
      }
      return acc;
    },
    { locationTags: [], categoryTags: [], customTags: [] },
  );

  return { locationTags, categoryTags, customTags };
}
