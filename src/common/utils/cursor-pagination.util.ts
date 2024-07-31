import { ApiProperty } from '@nestjs/swagger';

type HasId = { id: number };

export class cursorPaginationMeta<T extends HasId> {
  @ApiProperty()
  length?: number;

  @ApiProperty()
  take?: number;

  @ApiProperty()
  hasNextPage?: boolean;

  @ApiProperty()
  nextCursorId?: number;

  constructor(take: number, rawData: T[]) {
    this.take = take;
    this.hasNextPage = rawData.length == take + 1;
    this.length = this.hasNextPage ? take : rawData.length;
    this.nextCursorId = this.hasNextPage ? rawData[take - 1].id : null;
  }
}

export function paginateData<T extends HasId, U>(
  rawData: T[],
  take: number,
  transformFn: (item: T) => U,
): { data: U[]; meta: cursorPaginationMeta<T> } {
  const meta = new cursorPaginationMeta(take, rawData);
  const hasNextPage = meta.hasNextPage;

  const data = hasNextPage
    ? rawData.slice(0, take).map(transformFn)
    : rawData.map(transformFn);

  return { data, meta };
}
//T에는 id를 가진 Raw Data, U에는 Raw Data가 변환된 단일 Data를 넣어준다.
