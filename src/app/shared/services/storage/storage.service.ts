import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() { }

  public addItem(key: string, value: any): void {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  }

  public getItem(key: string): any {
    const data = window.sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  public clearStorage(key: string) {
    window.sessionStorage.removeItem(key);
  }
}
