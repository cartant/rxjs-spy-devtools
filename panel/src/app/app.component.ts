import { ChangeDetectionStrategy, Component } from '@angular/core';
import { scan } from 'rxjs/operators/scan';
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
  public displayedColumns = ['id', 'notification', 'tag', 'value'];

  constructor(spyService: SpyService) {
    const source = spyService.notifications.pipe(
      scan<Notification>((acc, notification) => [notification, ...acc], [] as Notification[])
    );
    this.dataSource = new DataSource(source);
  }
}
