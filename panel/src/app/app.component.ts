import { DataSource } from '@angular/cdk/collections';
import { Component, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Scheduler } from 'rxjs/Scheduler';
import { async } from 'rxjs/scheduler/async';
import { Subscription } from 'rxjs/Subscription';
import { fromEventPattern } from 'rxjs/observable/fromEventPattern';
import { CONTENT_MESSAGE, PANEL_CONNECT, PANEL_INIT } from '../../../extension/source/constants';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/observeOn';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/share';

type Message = any;
type MessageListener = (message: Message) => void;

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
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public dataSource: DataSource<Message>;
  public displayedColumns = ['id', 'notification', 'tag', 'value'];

  constructor(private _ngZone: NgZone) {

    if (chrome && chrome.devtools) {

      const tabId = chrome.devtools.inspectedWindow.tabId;
      const backgroundConnection = chrome.runtime.connect({ name: PANEL_CONNECT });
      backgroundConnection.postMessage({ name: PANEL_INIT, tabId });

      const backgroundMessages = fromEventPattern<Message>(
        (handler: MessageListener) => backgroundConnection.onMessage.addListener(handler),
        (handler: MessageListener) => backgroundConnection.onMessage.removeListener(handler)
      ).share();

      class MessageDataSource extends DataSource<Message> {

        constructor(private _messages: Observable<Message>) {
          super();
        }

        connect(): Observable<Message[]> {
          return this._messages
            .filter(message => message.name === CONTENT_MESSAGE)
            .map(message => message.params)
            .scan((acc, message) => [message, ...acc], [] as Message[])
            .observeOn(enterZone(_ngZone));
        }

        disconnect(): void {}
      }
      this.dataSource = new MessageDataSource(backgroundMessages);

    } else {
      console.warn('No Chrome DevTools environment.');
    }
  }
}
