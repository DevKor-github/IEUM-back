import { PlaceTag } from 'src/entities/place-tag.entity';

export function tagParser(placeTags: PlaceTag[]): {
  locationTags: string[];
  categoryTags: string[];
} {
  const { locationTags, categoryTags } = placeTags.reduce(
    (acc, placeTag) => {
      if (placeTag.tag.type === 0) {
        acc.locationTags.push(placeTag.tag.tagName);
      } else if (placeTag.tag.type === 2) {
        acc.categoryTags.push(placeTag.tag.tagName);
      }
      return acc;
    },
    { locationTags: [], categoryTags: [] },
  );

  return { locationTags, categoryTags };
}
