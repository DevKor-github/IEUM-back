import { ApiProperty } from '@nestjs/swagger';

export class NormalListMeta<T> {
  @ApiProperty()
  length: number;

  constructor(rawData: T[]) {
    this.length = rawData.length;
  }
}

export function createNormalList<T, U>(
  rawData: T[],
  transformFn: (item: T) => U,
): { items: U[]; meta: NormalListMeta<T> } {
  const meta = new NormalListMeta(rawData);

  const items = rawData.map(transformFn);

  return { meta, items };
}
