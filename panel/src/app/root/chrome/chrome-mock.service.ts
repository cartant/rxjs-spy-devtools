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
        graph: null,
        id: 0,
        messageType: 'notification',
        notification: 'before-next',
        postId: counter.toString(),
        postType: 'content-message',
        stackTrace: null,
        tag: 'mock',
        type: 'interval',
        value: counter
      })),
      share()
    );
  }
}
