import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ErrorService } from '../services/error/error.service';
import { ERROR_LIST } from './error.list';


@Injectable()

export class ErrorInterceptor implements HttpInterceptor {
  constructor(private errorService: ErrorService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(x => console.log(x)),
      catchError((error: any) => {
        this.errorService.handleError(new Error(ERROR_LIST[error.error.error.message]));
        return throwError(error);
      })
    );
  }
}
