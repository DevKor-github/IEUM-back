import { ErrorCodeEnum } from '../enums/error-code.enum';
import { CustomException } from './custom.exception';

export class NotValidPlaceException extends CustomException {
  constructor(message?: string) {
    super(ErrorCodeEnum.NotValidPlace, message);
  }
}

export class BadRequestImageFileException extends CustomException {
  constructor(message?: string) {
    super(ErrorCodeEnum.BadRequestImageFile, message);
  }
}
