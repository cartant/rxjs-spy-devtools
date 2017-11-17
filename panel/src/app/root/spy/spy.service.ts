import { Injectable } from '@angular/core';
import { CONTENT_MESSAGE } from '@devtools/constants';
import { isNotification, isPostRequest } from '@devtools/guards';
import { Notification, Post, Request } from '@devtools/interfaces';
import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators/filter';
import { share } from 'rxjs/operators/share';
import { ChromeService } from '../chrome';

@Injectable()
export class SpyService {

  public notifications: Observable<Notification>;
  public posts: Observable<Post>;
  public requests: Observable<Post & Request>;

  constructor(chromeService: ChromeService) {
    this.notifications = chromeService.posts.pipe(
      filter(post => post.postType === CONTENT_MESSAGE),
      filter(isNotification),
      share()
    );
    this.posts = chromeService.posts.pipe(
      filter(post => post.postType === CONTENT_MESSAGE),
      share()
    );
    this.requests = chromeService.posts.pipe(
      filter(post => post.postType === CONTENT_MESSAGE),
      filter(isPostRequest),
      share()
    );
  }
}
