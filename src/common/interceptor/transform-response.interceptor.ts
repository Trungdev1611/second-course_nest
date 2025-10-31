import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

//đồng bộ response success
@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
        map((data) => {
            console.log(`datareturn:::`, data)
            return {
                stauts: "success",
                meta: data?.metadata || null,
                data: data?.data || data,
            }
        })
    )
  }
}
