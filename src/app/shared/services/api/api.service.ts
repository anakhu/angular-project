import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FirebaseError } from 'firebase/app';
import { AppService } from '../app/app.service';
import { API_ERRORS } from './api-errors';

export interface Update {
  collection: string;
  docs: string;
  data?: any;
}

export interface CustomError {
  code: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  fireBase: any;
  constructor(
    private app: AppService,
    ) {
    this.fireBase = this.app.getFirebaseReference();
  }

  public getCollectionEntries<T>(reference: string): Observable<T[]> {

    return from(this.fireBase.ref(reference).once('value'))
      .pipe(
        map((data: firebase.database.DataSnapshot) => {
          return this._processDataOnLoad(data);
        })
      );
  }

  public updateEntry(reference: string, updates: any): Observable<any> {
    return from(this.fireBase.ref(reference).update(updates))
      .pipe(
        catchError((error: FirebaseError) => {
          const err: CustomError = {...API_ERRORS.update};
          throw err;
        })
      );
  }

  public addEntry(reference: string, entry: any): Observable<any> {
    return from(this.fireBase.ref(reference).set(entry))
      .pipe(
        catchError((error: FirebaseError) => {
          const err: CustomError = {...API_ERRORS.add};
          throw err;
        })
      );
  }

  public pushEntry(reference: string, entry: any): Observable<string> {
    return from(this.fireBase.ref(reference).push(entry))
      .pipe(
        catchError((error: FirebaseError) => {
          const err: CustomError = {...API_ERRORS.push};
          throw err;
        }),
        map((payload: firebase.database.Reference) => payload.key)
      );
  }

  public deleteEntry(reference: string): Observable<any> {
    return from(this.fireBase.ref(reference).remove())
      .pipe(
        catchError((error: FirebaseError) => {
          const err: CustomError = {...API_ERRORS.delete};
          throw err;
        }),
      );
  }

  public getByChildValue(reference: string, child: string, value: any): Observable<any> {
    return from(this.fireBase.ref(`${reference}`)
      .orderByChild(child)
      .equalTo(value)
      .once('value'))
      .pipe(
        map((data: firebase.database.DataSnapshot) => {
          return this._processDataOnLoad(data);
        })
      );
  }

  public deleteSimultaneously(data: Update[]): Observable<boolean> {
    const updates = {};

    for (const entry of data) {
      updates[`/${entry.collection}/` + entry.docs] = entry.data ? entry.data : null;
    }

    return from(this.fireBase.ref().update(updates))
      .pipe(
        map((response: any) => {
          console.log(response);
          if (response instanceof Error) {
            const err: CustomError = {...API_ERRORS.delete};
            return false;
          }
          return true;
        })
      );
  }

  private _processDataOnLoad<T>(response: any): T[] {
    const data: T[] = [];
    response.forEach((child: any) => {
      const id = child.key;
      const value = child.val();
      data.push({id, ...value});
    });
    return data;
  }
}
