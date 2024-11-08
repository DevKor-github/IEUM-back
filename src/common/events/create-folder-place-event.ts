export class CreateFolderPlaceEvent {
  constructor(
    public readonly userId: number,
    public readonly placeId: number,
    public readonly folderId: number,
  ) {}
}
