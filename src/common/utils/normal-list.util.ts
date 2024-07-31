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
): { data: U[]; meta: NormalListMeta<T> } {
  const meta = new NormalListMeta(rawData);

  const data = rawData.map(transformFn);

  return { data, meta };
}
