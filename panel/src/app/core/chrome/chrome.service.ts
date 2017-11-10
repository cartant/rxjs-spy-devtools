import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { fromEventPattern } from 'rxjs/observable/fromEventPattern';
import { observeOn } from 'rxjs/operators/observeOn';
import { share } from 'rxjs/operators/share';
import { enterZone } from '@app/shared/utils';
import { PANEL_CONNECT, PANEL_INIT } from '@ext/source/constants';
import { Message, MessageListener } from './types';

@Injectable()
export class ChromeService {

  public messages: Observable<Message>;

  constructor(ngZone: NgZone) {
    if ((typeof chrome !== 'undefined') && chrome && chrome.devtools) {
      const tabId = chrome.devtools.inspectedWindow.tabId;
      const backgroundConnection = chrome.runtime.connect({ name: PANEL_CONNECT });
      backgroundConnection.postMessage({ name: PANEL_INIT, tabId });

      this.messages = fromEventPattern<Message>(
        handler => backgroundConnection.onMessage.addListener(handler as MessageListener),
        handler => backgroundConnection.onMessage.removeListener(handler as MessageListener)
      ).pipe(
        observeOn(enterZone(ngZone)),
        share()
      );

    } else {
      console.warn('No Chrome DevTools environment.');
      this.messages = empty<Message>();
    }
  }
}
