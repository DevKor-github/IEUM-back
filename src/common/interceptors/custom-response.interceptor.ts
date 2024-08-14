import {
  CallHandler,
  ContextType,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomResponse } from '../enums/custom-response.enum';

type ExtendedContextType = ContextType | 'rmq';

@Injectable()
export class CustomResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if ((context.getType() as ExtendedContextType) === 'rmq') {
          return data;
        }
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
