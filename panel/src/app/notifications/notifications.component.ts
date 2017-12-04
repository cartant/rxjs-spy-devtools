import { ChangeDetectionStrategy, Component } from '@angular/core';
import { APP_AUDIT_TIME } from '@app/constants';
import { Notification, selectAllNotifications, State } from '@app/root/spy';
import { DataSource } from '@app/shared/utils';
import { Store } from '@ngrx/store';
import { auditTime } from 'rxjs/operators/auditTime';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {

  public dataSource: DataSource<Notification>;
  public displayedColumns = ['id', 'notification', 'tag', 'type', 'value'];

  constructor(private _store: Store<State>) {
    this.dataSource = new DataSource(_store.select(selectAllNotifications).pipe(
      auditTime(APP_AUDIT_TIME)
    ));
  }
}
