import { Injectable, NgZone, Provider } from '@angular/core';
import { enterZone } from '@app/shared/utils';
import { PANEL_BACKGROUND_CONNECT, PANEL_BACKGROUND_INIT, PANEL_MESSAGE } from '@devtools/constants';
import { Message, Post } from '@devtools/interfaces';
import { fromEventPattern, Observable } from 'rxjs';
import { observeOn, share } from 'rxjs/operators';
import { ChromeMockService } from './chrome-mock.service';
import { MessageListener } from './types';

@Injectable()
export class ChromeService {

  private static _posts = 0;
  public posts: Observable<Post>;
  private _backgroundConnection: chrome.runtime.Port;

  public static forRoot(): Provider {
    return { deps: [NgZone], provide: ChromeService, useFactory: createChromeService };
  }

  constructor(ngZone: NgZone) {

    const tabId = chrome.devtools.inspectedWindow.tabId;
    this._backgroundConnection = chrome.runtime.connect({ name: PANEL_BACKGROUND_CONNECT });
    this._backgroundConnection.postMessage({ postType: PANEL_BACKGROUND_INIT, tabId });

    this.posts = fromEventPattern<Post>(
      handler => this._backgroundConnection.onMessage.addListener(handler as MessageListener),
      handler => this._backgroundConnection.onMessage.removeListener(handler as MessageListener)
    ).pipe(
      observeOn(enterZone(ngZone)),
      share()
    );
  }

  post(message: Message): Post {
    const tabId = chrome.devtools.inspectedWindow.tabId;
    const post = { ...message, postId: (++ChromeService._posts).toString(), postType: PANEL_MESSAGE, tabId };
    setTimeout(() => this._backgroundConnection.postMessage(post), 0);
    return post;
  }
}

export function createChromeService(ngZone: NgZone): ChromeMockService | ChromeService {
  return ((typeof chrome !== 'undefined') && chrome && chrome.devtools) ?
    new ChromeService(ngZone) :
    new ChromeMockService(ngZone);
}
