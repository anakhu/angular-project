import { Injectable, ErrorHandler} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService implements ErrorHandler{
  constructor() {}

  private errorSubject = new BehaviorSubject<Error>(null);

  public subscribe(): Observable<Error> {
    return this.errorSubject.asObservable();
  }

  public handleError(error: Error): Error {
    this.errorSubject.next(error);
    return error;
  }
}
