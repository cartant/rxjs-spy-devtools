import { Injectable } from '@angular/core';
import { CONTENT_MESSAGE } from '@devtools/constants';
import { isNotification, isPostRequest, isPostResponse } from '@devtools/guards';
import { Notification, Post, Request, Response } from '@devtools/interfaces';
import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators/filter';
import { take } from 'rxjs/operators/take';
import { share } from 'rxjs/operators/share';
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
      filter(isNotification),
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

  request(request: Request): Observable<Post & Response> {
    const { postId } = this._chromeService.post(request);
    return this.responses.pipe(
      filter(response => response.request.postId === postId),
      take(1)
    );
  }
}
