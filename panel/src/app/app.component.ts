import { Component, NgZone } from '@angular/core';
import { fromEventPattern } from 'rxjs/observable/fromEventPattern';
import { CONTENT_MESSAGE, PANEL_CONNECT, PANEL_INIT } from '../../../extension/source/constants';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/share';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public message = '';

  constructor(private _ngZone: NgZone) {

    if (chrome && chrome.devtools) {

      const tabId = chrome.devtools.inspectedWindow.tabId;
      const backgroundConnection = chrome.runtime.connect({ name: PANEL_CONNECT });
      backgroundConnection.postMessage({ name: PANEL_INIT, tabId });

      type Message = any;
      type MessageListener = (message: Message) => void;

      const backgroundMessages = fromEventPattern<Message>(
        (handler: MessageListener) => backgroundConnection.onMessage.addListener(handler),
        (handler: MessageListener) => backgroundConnection.onMessage.removeListener(handler)
      ).share();

      backgroundMessages.filter(message => message.name === CONTENT_MESSAGE).subscribe(message => {
        _ngZone.run(() => { this.message = JSON.stringify(message, null, 2); });
      });

    } else {
      console.warn('No Chrome DevTools environment.');
    }
  }
}
