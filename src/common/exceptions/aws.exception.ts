import { ErrorCodeEnum } from '../enums/error-code.enum';
import { CustomException } from './custom.exception';

export class AWSS3ErrorException extends CustomException {
  constructor(message?: string) {
    super(ErrorCodeEnum.AWSS3Error, message);
  }
}
