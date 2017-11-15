import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { fromEventPattern } from 'rxjs/observable/fromEventPattern';
import { observeOn } from 'rxjs/operators/observeOn';
import { share } from 'rxjs/operators/share';
import { enterZone } from '@app/shared/utils';
import { PANEL_BACKGROUND_CONNECT, PANEL_BACKGROUND_INIT } from '@devtools/constants';
import { Post } from '@devtools/interfaces';
import { MessageListener } from './types';

@Injectable()
export class ChromeService {

  public posts: Observable<Post>;

  constructor(ngZone: NgZone) {
    if ((typeof chrome !== 'undefined') && chrome && chrome.devtools) {
      const tabId = chrome.devtools.inspectedWindow.tabId;
      const backgroundConnection = chrome.runtime.connect({ name: PANEL_BACKGROUND_CONNECT });
      backgroundConnection.postMessage({ postType: PANEL_BACKGROUND_INIT, tabId });

      this.posts = fromEventPattern<Post>(
        handler => backgroundConnection.onMessage.addListener(handler as MessageListener),
        handler => backgroundConnection.onMessage.removeListener(handler as MessageListener)
      ).pipe(
        observeOn(enterZone(ngZone)),
        share()
      );

    } else {
      console.warn('No Chrome DevTools environment.');
      this.posts = empty<Post>();
    }
  }
}
