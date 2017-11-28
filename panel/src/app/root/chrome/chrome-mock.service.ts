import { Injectable, NgZone } from '@angular/core';

import {
  CONTENT_MESSAGE,
  MESSAGE_CONNECT,
  MESSAGE_NOTIFICATION,
  MESSAGE_REQUEST,
  MESSAGE_RESPONSE,
  PANEL_MESSAGE
} from '@devtools/constants';

import {
  Message,
  Notification,
  ObservableSnapshot,
  Post,
  SubscriberSnapshot,
  SubscriptionSnapshot
} from '@devtools/interfaces';

import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { interval } from 'rxjs/observable/interval';
import { merge } from 'rxjs/observable/merge';
import { timer } from 'rxjs/observable/timer';
import { map } from 'rxjs/operators/map';
import { share } from 'rxjs/operators/share';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ChromeMockService {

  public posts: Observable<Post>;
  private _observable: ObservableSnapshot;
  private _subject: Subject<Post>;
  private _subscriber: SubscriberSnapshot;
  private _subscription: SubscriptionSnapshot;

  constructor(ngZone: NgZone) {

    console.warn('Using mock Chrome service.');

    this._observable = {
      id: '1',
      path: '/interval',
      subscriptions: ['3'],
      tag: 'mock',
      tick: 0,
      type: 'interval'
    };
    this._subject = new Subject<Post>();
    this._subscriber = {
      id: '2',
      subscriptions: ['3'],
      tick: 0,
      values: [],
      valuesFlushed: 0
    };
    this._subscription = {
      complete: false,
      error: undefined,
      graph: null,
      id: '3',
      observable: '1',
      stackTrace: null,
      subscriber: '2',
      tick: 0,
      timestamp: 0,
      unsubscribed: false
    };

    this.posts = merge(
      interval(1000).pipe(
        map(counter => ({
          id: counter.toString(),
          messageType: MESSAGE_NOTIFICATION,
          notification: 'before-next',
          observable: pick(this._observable, 'id', 'tag', 'type'),
          postId: counter.toString(),
          postType: CONTENT_MESSAGE,
          subscriber: pick(this._subscriber, 'id'),
          subscription: pick(this._subscription, 'graph', 'id', 'stackTrace'),
          tick: counter,
          timestamp: Date.now(),
          value: { json: JSON.stringify(counter) }
        })),
        share()
      ),
      timer(3000).pipe(
        map(counter => ({
          messageType: MESSAGE_CONNECT,
          postId: '-1',
          postType: 'content-message'
        })),
        share()
      ),
      this._subject
    );
  }

  post(message: Message): Post {
    const post = {
      ...message,
      postId: '0',
      postType: PANEL_MESSAGE
    };
    setTimeout(() => {
      if (message.messageType === MESSAGE_REQUEST) {
        const request = {
          messageType: MESSAGE_RESPONSE,
          postId: '1',
          postType: CONTENT_MESSAGE,
          request: { ...message, ...post },
          snapshot: {
            observables: [this._observable],
            subscribers: [this._subscriber],
            subscriptions: [this._subscription]
          }
        };
        this._subject.next(request);
      }
    }, 0);
    return post;
  }
}

function pick<T, K extends keyof T>(value: T, ...keys: K[]): Pick<T, K> {
  const picked: any = {};
  keys.forEach(key => picked[key] = value[key]);
  return picked;
}
