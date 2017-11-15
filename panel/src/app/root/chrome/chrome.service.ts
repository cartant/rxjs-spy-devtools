import { Injectable, NgZone, Provider } from '@angular/core';
import { PANEL_BACKGROUND_CONNECT, PANEL_BACKGROUND_INIT } from '@devtools/constants';
import { Post } from '@devtools/interfaces';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { fromEventPattern } from 'rxjs/observable/fromEventPattern';
import { observeOn } from 'rxjs/operators/observeOn';
import { share } from 'rxjs/operators/share';
import { enterZone } from '@app/shared/utils';
import { ChromeMockService } from './chrome-mock.service';
import { MessageListener } from './types';

export function createChromeService(ngZone: NgZone): ChromeMockService | ChromeService {
  return ((typeof chrome !== 'undefined') && chrome && chrome.devtools) ?
    new ChromeService(ngZone) :
    new ChromeMockService(ngZone);
}

@Injectable()
export class ChromeService {

  public posts: Observable<Post>;

  public static forRoot(): Provider {
    return { deps: [NgZone], provide: ChromeService, useFactory: createChromeService };
  }

  constructor(ngZone: NgZone) {

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
  }
}
