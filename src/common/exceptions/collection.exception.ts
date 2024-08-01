import { ErrorCodeEnum } from '../enums/error-code.enum';
import { CustomException } from './custom.exception';

export class ConflictedCollectionException extends CustomException {
  constructor(message?: string) {
    super(ErrorCodeEnum.ConflictedCollection, message);
  }
}
