import {
  CallHandler,
  ContextType,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
          statusCode: context.switchToHttp().getResponse().statusCode,
          data: data,
        };
      }),
    );
  }
}
