import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException } from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, retryWhen, delay, scan, timeout } from 'rxjs/operators';

@Injectable()
export class RetryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(15000), // Global 15s timeout
      retryWhen(errors =>
        errors.pipe(
          scan((retryCount, error) => {
            if (retryCount >= 3) {
              throw error; // Max retries reached
            }
            // Retry on specific transient errors (e.g. MongoDB timeouts, Deadlocks, Network issues)
            const isTransient = error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError' || error instanceof TimeoutError || error.status === 503 || error.status === 429;
            if (!isTransient) {
              throw error;
            }
            return retryCount + 1;
          }, 0),
          delay(1000) // 1 second delay between retries
        )
      ),
      catchError(err => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException('Request timeout, please try again later.'));
        }
        return throwError(() => err);
      })
    );
  }
}
