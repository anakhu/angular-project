import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  constructor(
    private storage: StorageService
  ) { }

  public getPage(reference: string, itemsTotal: number, itemsPerPage: number ) {
    const page = this.storage.getItem(reference);
    if (page) {
      const pageMax = Math.ceil(itemsTotal / itemsPerPage);
      if (page && page <= pageMax) {
        return page;
      } else {
        return pageMax;
      }
    }
    return 1;
  }

  public saveCurrentPage(reference: string, page: number) {
    this.storage.addItem(reference, page);
  }
}
