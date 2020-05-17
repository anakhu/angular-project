import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor( private http: HttpClient ) { }

  public getAll<T>(collection: string, metadata: boolean = false): Observable<T[]>{
    return this.http.get(`${environment.databaseURL}/${collection}.json`)
      .pipe(
        map((response: T[]) => this._processResponse(response, metadata)),
      );
  }

  private _processResponse<T>(response: T[], metadata: boolean = false): T[] {
    const result: T[] = [];
      // tslint:disable-next-line: forin
    for (const key in response) {
      const entry: T = metadata ? {...response[key], id: key} : { ...response[key]};
      result.push(entry);
    }
    return result;
  }

  public getItem(collection: string, id: string): Observable<any> {
    return this.http.get(`${environment.databaseURL}/${collection}/${id}.json`);
  }

  public updateItem(collection: string, item: any): Observable<any> {
    return this.http.put(`${environment.databaseURL}/${collection}/${item.id}.json`, item);
  }

  public addItem(collection: string, item: any): Observable<any> {
    return this.http.post(`${environment.databaseURL}/${collection}.json`, item);
  }

  public deleteItem(collection: string, id: string): Observable<any> {
    return this.http.delete(`${environment.databaseURL}/${collection}/${id}.json`);
  }
}
