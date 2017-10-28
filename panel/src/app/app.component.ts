import { Component } from '@angular/core';
import { scan } from 'rxjs/operators/scan';
import { Notification, SpyService } from '@app/core/spy';
import { DataSource } from '@app/shared/utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
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
