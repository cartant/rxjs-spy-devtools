import { Component } from '@angular/core';
import { scan } from 'rxjs/operators/scan';
import { ChromeService, Message } from '@app/core/chrome';
import { DataSource } from '@app/shared/utils/data-source';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public dataSource: DataSource<Message>;
  public displayedColumns = ['id', 'notification', 'tag', 'value'];

  constructor(service: ChromeService) {
    this.dataSource = new DataSource(service.messages.pipe(
      scan((acc, message) => [message, ...acc], [] as Message[])
    ));
  }
}
