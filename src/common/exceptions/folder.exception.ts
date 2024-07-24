import { ErrorCodeEnum } from '../enums/error-code.enum';
import { CustomException } from './custom.exception';

export class ForbiddenFolderException extends CustomException {
  constructor(message?: string) {
    super(ErrorCodeEnum.ForbiddenFolder, message);
  }
}
