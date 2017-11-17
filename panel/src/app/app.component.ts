import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { auditTime } from 'rxjs/operators/auditTime';
import { map } from 'rxjs/operators/map';
import { APP_AUDIT_TIME } from '@app/constants';
import { Notification, selectAllNotifications, State } from '@app/root/spy';
import { DataSource } from '@app/shared/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent {

  public dataSource: DataSource<Notification>;
  public displayedColumns = ['id', 'notification', 'tag', 'type', 'value'];

  constructor(store: Store<State>) {
    const source = store.pipe(
      map(selectAllNotifications),
      auditTime(APP_AUDIT_TIME)
    );
    this.dataSource = new DataSource(source);
  }
}
