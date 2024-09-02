interface ieumExceptionData {
  name: string;
  message: string;
  errorCode: number;
  statusCode: number;
}

export const ieumExceptions: Record<string, ieumExceptionData> = {};

export type ieumExceptionName = keyof typeof ieumExceptions;

export class ieumException extends Error {
  errorCode: number;
  statusCode: number;

  constructor(name: ieumExceptionName) {
    super(ieumExceptions[name].message);
    this.name = name;
    this.errorCode = ieumExceptions[name].errorCode;
    this.statusCode = ieumExceptions[name].statusCode;
  }
}

export function throwIeumException(name: ieumExceptionName): never {
  throw new ieumException(name);
}

//필터에서는 이러한 것들을 Catch
