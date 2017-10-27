import { DataSource } from '@angular/cdk/collections';
import { Component, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { observeOn } from 'rxjs/operators/observeOn';
import { scan } from 'rxjs/operators/scan';
import { Scheduler } from 'rxjs/Scheduler';
import { async } from 'rxjs/scheduler/async';
import { Subscription } from 'rxjs/Subscription';
import { ChromeService, Message } from '@app/core/chrome';

class EnterZoneScheduler {

  constructor(private _zone: NgZone, private _scheduler: Scheduler) {}

  schedule(...args: any[]): Subscription {
    const { _scheduler, _zone } = this;
    return _zone.run(() => _scheduler.schedule.apply(_scheduler, args));
  }
}

export function enterZone(zone: NgZone, scheduler: Scheduler = async): Scheduler {
    return new EnterZoneScheduler(zone, scheduler) as any;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public dataSource: DataSource<Message>;
  public displayedColumns = ['id', 'notification', 'tag', 'value'];

  constructor(private _service: ChromeService, private _ngZone: NgZone) {

    class MessageDataSource extends DataSource<Message> {

      constructor(private _messages: Observable<Message>) {
        super();
      }

      connect(): Observable<Message[]> {
        return this._messages.pipe(
          scan((acc, message) => [message, ...acc], [] as Message[]),
          observeOn(enterZone(_ngZone))
        );
      }

      disconnect(): void {}
    }
    this.dataSource = new MessageDataSource(this._service.messages);
  }
}
