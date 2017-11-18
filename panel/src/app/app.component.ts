import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Notification, selectAllNotifications, selectAllObservables, SpyService, State } from '@app/root/spy';
import { DataSource } from '@app/shared/utils';
import { ObservableSnapshot } from '@devtools/interfaces';
import { Store } from '@ngrx/store';
import { auditTime } from 'rxjs/operators/auditTime';
import { map } from 'rxjs/operators/map';
import { APP_AUDIT_TIME } from '@app/constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent {

  public notificationDataSource: DataSource<Notification>;
  public notificationDisplayedColumns = ['id', 'notification', 'tag', 'type', 'value'];
  public observableDataSource: DataSource<Partial<ObservableSnapshot>>;
  public observableDisplayedColumns = ['id', 'tag', 'type', 'log'];

  constructor(private _spyService: SpyService, store: Store<State>) {
    this.notificationDataSource = new DataSource(store.pipe(
      map(selectAllNotifications),
      auditTime(APP_AUDIT_TIME)
    ));
    this.observableDataSource = new DataSource(store.pipe(
      map(selectAllObservables),
      auditTime(APP_AUDIT_TIME)
    ));
  }

  log(id: string): void {
    const request = {
      match: id,
      requestType: 'log'
    };
    this._spyService.request(request);
  }
}
