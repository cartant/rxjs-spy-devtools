import { Injectable } from '@angular/core';
import { CONTENT_MESSAGE, MESSAGE_REQUEST } from '@devtools/constants';
import { isBroadcast, isPostRequest, isPostResponse } from '@devtools/guards';
import { Broadcast, Message, Notification, Post, Request, Response } from '@devtools/interfaces';
import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';
import { share } from 'rxjs/operators/share';
import { take } from 'rxjs/operators/take';
import { ChromeService } from '../chrome';

@Injectable()
export class SpyService {

  public notifications: Observable<Notification>;
  public posts: Observable<Post>;
  public requests: Observable<Post & Request>;
  public responses: Observable<Post & Response>;

  constructor(private _chromeService: ChromeService) {
    this.notifications = _chromeService.posts.pipe(
      filter(post => post.postType === CONTENT_MESSAGE),
      filter(isBroadcast),
      filter(message => message.broadcastType === 'notification'),
      map(message => message.notification as Notification),
      share()
    );
    this.posts = _chromeService.posts.pipe(
      filter(post => post.postType === CONTENT_MESSAGE),
      share()
    );
    this.requests = _chromeService.posts.pipe(
      filter(post => post.postType === CONTENT_MESSAGE),
      filter(isPostRequest),
      share()
    );
    this.responses = _chromeService.posts.pipe(
      filter(post => post.postType === CONTENT_MESSAGE),
      filter(isPostResponse),
      share()
    );
  }

  post(message: Message): Post {
    return this._chromeService.post(message);
  }

  request(request: { [key: string]: any; requestType: string }): Observable<Post & Response> {
    const message = { ...request, messageType: MESSAGE_REQUEST };
    const { postId } = this.post(message);
    return this.responses.pipe(
      filter(response => response.request.postId === postId),
      take(1)
    );
  }
}
