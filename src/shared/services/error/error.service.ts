import { Injectable, ErrorHandler, ɵConsole } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class ErrorService implements ErrorHandler{

  constructor(
    private router: Router
  ) {}

  public handleError(error: Error): void {
    console.warn(`Error Service: ${error.message}`);
    console.log(error.stack);
  }
}
