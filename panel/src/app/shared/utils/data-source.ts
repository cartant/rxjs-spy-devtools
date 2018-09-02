import { DataSource as BaseDataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';

export class DataSource<T> extends BaseDataSource<T> {

  constructor(private _source: Observable<T[]>) {
    super();
  }

  connect(): Observable<T[]> { return this._source; }
  disconnect(): void {}
}
