import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException ? ((exception.getResponse() as any).message || exception.message): "Internal Server"
    response
      .status(status)
      .json({
        status: 'error',
        message: message,
        route: request.url,
        type: "custom-error"
      });
  }
}
