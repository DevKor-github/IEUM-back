import { ErrorCodeEnum } from '../enums/error-code.enum';
import { CustomException } from './custom.exception';

export class NotValidFolderException extends CustomException {
  constructor(message?: string) {
    super(ErrorCodeEnum.NotValidFolder, message);
  }
}
export class ForbiddenFolderException extends CustomException {
  constructor(message?: string) {
    super(ErrorCodeEnum.ForbiddenFolder, message);
  }
}
