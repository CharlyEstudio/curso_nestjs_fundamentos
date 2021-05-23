import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // tap

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // console.log('Before...', context.getHandler().name);
    // return next.handle().pipe(tap((data) => console.log('After...', data)));
    return next.handle().pipe(
      map((data) => {
        // console.log('After...', data);
        return { data };
      }),
    );
  }
}
