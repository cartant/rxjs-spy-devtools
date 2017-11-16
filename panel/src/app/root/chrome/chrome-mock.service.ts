import { Injectable, NgZone } from '@angular/core';
import { Notification, Post } from '@devtools/interfaces';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { interval } from 'rxjs/observable/interval';
import { map } from 'rxjs/operators/map';
import { share } from 'rxjs/operators/share';

@Injectable()
export class ChromeMockService {

  public posts: Observable<Post>;

  constructor(ngZone: NgZone) {
    console.warn('Using mock Chrome service.');
    this.posts = interval(1000).pipe(
      map(counter => ({
        id: counter.toString(),
        messageType: 'notification',
        notification: 'before-next',
        observable: {
          id: '0',
          tag: 'mock',
          type: 'interval'
        },
        postId: counter.toString(),
        postType: 'content-message',
        subscriber: {
          id: '0'
        },
        subscription: {
          graph: null,
          id: '0',
          stackTrace: null
        },
        tick: counter,
        timestamp: Date.now(),
        value: { json: JSON.stringify(counter) }
      })),
      share()
    );
  }
}
