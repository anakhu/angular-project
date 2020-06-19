import { Injectable, ErrorHandler} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserErrors } from '../error-list';


@Injectable({
  providedIn: 'root'
})
export class ErrorService implements ErrorHandler{
  public errorSubject = new BehaviorSubject<string>('');
  constructor() {}

  public createSubscription(): Observable<string> {
    return this.errorSubject.asObservable();
  }

  public handleError(error: any) {
    if (error?.code && UserErrors[error?.code]) {
      this.createErrorMessage(error);
    } else {
      console.log(error);
    }
  }

  private createErrorMessage(error: Error) {
    const message = error.message ? error.message : 'Unknown error';
    this.errorSubject.next(message);
  }
}
