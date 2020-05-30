import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { map, concatMap } from 'rxjs/operators';
import { AppService } from '../app/app.service';

export interface UploadedTaskSnapshot {
  bytesTransferred: number;
  metadata: any;
  ref: any;
  state: string;
  task: any;
  totalBytes: number;
}

export interface UploadUpdate {
  senderId: string;
  reference: string;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  fireStorage: any;

  constructor(
    private app: AppService,
  ){
    this.fireStorage = this.app.getFireStorageReference();
  }

  public sendFile(file: File, reference: string, senderId: string): Observable<UploadUpdate | Error> {
    const ref = this._createReference(`${reference}/${senderId}/${file.name}`);
    return from(ref.put(file))
      .pipe(
        concatMap((result: UploadedTaskSnapshot) => {
          if (result.state === 'success') {
            return from(ref.getDownloadURL());
          } else {
            throw Error('File wasn\'t uploaded');
          }
        }),
        map((link: any) => {
          const image = decodeURI(link).toString();
          return {
            senderId,
            reference,
            image
          };
        }),
    );
  }

  private _createReference(path: string) {
    return this.fireStorage.ref(path);
  }
}
