import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

//đồng bộ response success
@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    const request = context.switchToHttp().getRequest();
    
    return next.handle().pipe(
      // tap(() => {
      //   // Chỉ áp dụng cache policy cho API endpoints, không phải static files
      //   if (request.url.startsWith('/api/') || 
      //       request.url.startsWith('/blog/') || 
      //       request.url.startsWith('/auth/') ||
      //       request.url.startsWith('/user/') ||
      //       request.url.startsWith('/tag/') ||
      //       request.url.startsWith('/comment/')) {
      //     // Cache ngắn hạn (30 giây) thay vì tắt hoàn toàn
      //     // must-revalidate: phải kiểm tra với server trước khi dùng cache cũ
      //     response.setHeader('Cache-Control', 'private, max-age=30, must-revalidate');
      //   }
      //   // Static files và các routes khác có thể có cache policy riêng
      // }),
      map((data) => {
        return {
          status: "success",
          meta: data?.metadata || null,
          data: data?.data || data,
        }
      })
    )
  }
}
