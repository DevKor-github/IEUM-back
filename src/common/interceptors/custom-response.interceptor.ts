import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomResponse } from '../enums/custom-response.enum';

@Injectable()
export class CustomResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return {
          statusCode:
            data !== undefined
              ? CustomResponse.SuccessWithData
              : CustomResponse.SuccessWithoutData,
          response: data !== undefined ? data : null,
        };
      }),
    );
  }
}
