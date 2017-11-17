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
  private observable_: ObservableSnapshot;
  private subject_: Subject<Post>;
  private subscriber_: SubscriberSnapshot;
  private subscription_: SubscriptionSnapshot;

  constructor(ngZone: NgZone) {

    console.warn('Using mock Chrome service.');

    this.observable_ = {
      id: '1',
      subscriptions: ['3'],
      tag: 'mock',
      tick: 0/*,
      type: 'interval'*/
    };
    this.subject_ = new Subject<Post>();
    this.subscriber_ = {
      id: '2',
      subscriptions: ['3'],
      tick: 0,
      values: [],
      valuesFlushed: 0
    };
    this.subscription_ = {
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
          observable: pluck(this.observable_, 'id', 'tag', 'type'),
          postId: counter.toString(),
          postType: CONTENT_MESSAGE,
          subscriber: pluck(this.subscriber_, 'id'),
          subscription: pluck(this.subscription_, 'graph', 'id', 'stackTrace'),
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
      this.subject_
    );
  }

  post(message: Message): Post {
    const post = {
      ...message,
      postId: '0',
      postType: PANEL_MESSAGE
    };
    if (message.messageType === MESSAGE_REQUEST) {
      const request = {
        messageType: MESSAGE_RESPONSE,
        postId: '1',
        postType: CONTENT_MESSAGE,
        request: { ...message, ...post },
        snapshot: {
          observables: [this.observable_],
          subscribers: [this.subscriber_],
          subscriptions: [this.subscription_]
        }
      };
      setTimeout(() => this.subject_.next(request), 100);
    }
    return post;
  }
}

function pluck(value: object, ...props: string[]): any {
  const plucked: any = {};
  props.forEach(prop => plucked[prop] = value[prop]);
  return plucked;
}
