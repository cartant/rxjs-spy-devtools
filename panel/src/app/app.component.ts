import { ChangeDetectionStrategy, Component } from '@angular/core';
import { auditTime } from 'rxjs/operators/auditTime';
import { scan } from 'rxjs/operators/scan';
import { UI_AUDIT_TIME } from '@app/constants';
import { SpyService } from '@app/root/spy';
import { DataSource } from '@app/shared/utils';
import { Notification } from '@devtools/interfaces';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent {

  public dataSource: DataSource<Notification>;
  public displayedColumns = ['subscriptionId', 'notification', 'tag', 'value'];

  constructor(spyService: SpyService) {
    const source = spyService.notifications.pipe(
      scan<Notification>((acc, notification) => [notification, ...acc], [] as Notification[]),
      auditTime(UI_AUDIT_TIME)
    );
    this.dataSource = new DataSource(source);
  }
}
