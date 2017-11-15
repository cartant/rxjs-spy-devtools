import { Injectable } from '@angular/core';
import { CONTENT_MESSAGE } from '@devtools/constants';
import { isNotification, isRequest } from '@devtools/guards';
import { Notification, Request } from '@devtools/interfaces';
import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators/filter';
import { share } from 'rxjs/operators/share';
import { ChromeService } from '../chrome';

@Injectable()
export class SpyService {

  public notifications: Observable<Notification>;
  public requests: Observable<Request>;

  constructor(chromeService: ChromeService) {
    this.notifications = chromeService.posts.pipe(
      filter(post => post.postType === CONTENT_MESSAGE),
      filter(isNotification),
      share()
    );
    this.requests = chromeService.posts.pipe(
      filter(post => post.postType === CONTENT_MESSAGE),
      filter(isRequest),
      share()
    );
  }
}
