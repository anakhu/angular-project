import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, from, of, pipe } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/auth';
import { ErrorService } from '../error/error.service';
import { FirebaseError } from 'firebase/app';
import { AppService } from '../app/app.service';


export interface Collection {
  collection: string;
  docs: string;
  data?: any;
}

export interface Update {
  collection: string;
  update: {
    doc: string,
    data: any
  };
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  fireBase: any;

  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
    private app: AppService
    ) {
      this.fireBase = this.app.getFirebaseReference();
    // this._initFireBaseServices();
  }

  // private _initFireBaseServices(): void {
  //   firebase.initializeApp({
  //     ...environment
  //   });
  //   this.fireBase = firebase.database();
  // }

  // public getFireStorageRef(): any {
  //   return firebase.storage();
  // }

  // public getFireAuthRef(): any {
  //   return firebase.auth();
  // }

  // public getFireBaseReference(): any {
  //   return this.fireBase;
  // }

  private _processDataOnLoad<T>(response: any): T[] {
    const data: T[] = [];
    response.forEach((child: any) => {
      const id = child.key;
      const value = child.val();
      data.push({id, ...value});
    });
    return data;
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
          this.errorService.handleError(error);
          return Error;
        })
      );
  }

  public addEntry(reference: string, entry: any): Observable<any> {
    return from(this.fireBase.ref(reference).set(entry))
      .pipe(
        catchError((error: FirebaseError) => {
          this.errorService.handleError(error);
          return Error;
        })
      );
  }

  public pushEntry(reference: string, entry: any): Observable<string> {
    return from(this.fireBase.ref(reference).push(entry))
      .pipe(
        catchError((error: FirebaseError) => {
          this.errorService.handleError(error);
          return Error;
        }),
        map((payload: firebase.database.Reference) => payload.key)
      );
  }

  public deleteEntry(reference: string): Observable<any> {
    return from(this.fireBase.ref(reference).remove())
      .pipe(
        catchError((error: FirebaseError) => {
          this.errorService.handleError(error);
          return Error;
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

  public deleteSimultaneously(data: Collection[]): Observable<boolean> {
    const updates = {};

    for (const entry of data) {
      updates[`/${entry.collection}/` + entry.docs] = entry.data ? entry.data : null;
    }
    console.log(updates);

    return from(this.fireBase.ref().update(updates))
      .pipe(
        map((response: any) => {
          console.log(response);
          if (response instanceof Error) {
            this.errorService.handleError(response);
            return false;
          }
          return true;
        })
      );
  }
}
