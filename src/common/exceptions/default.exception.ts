import { ErrorCodeEnum } from '../enums/error-code.enum';
import { CustomException } from './custom.exception';

export class DefaultBadRequestException extends CustomException {
  constructor(message?: string) {
    super(ErrorCodeEnum.DefaultBadRequest, message);
  }
}

export class DefaultUnauthorizedException extends CustomException {
  constructor(message?: string) {
    super(ErrorCodeEnum.DefaultUnauthorized, message);
  }
}

export class DefaultUndefinedException extends CustomException {
  constructor(message?: string) {
    super(ErrorCodeEnum.DefaultUndefined, message);
  }
}

export class DefaultInternalServerErrorException extends CustomException {
  constructor(message?: string) {
    super(ErrorCodeEnum.DefaultInternalServerError, message);
  }
}

export class DefaultForbiddenException extends CustomException {
  constructor(message?: string) {
    super(ErrorCodeEnum.DefaultForbidden, message);
  }
}
