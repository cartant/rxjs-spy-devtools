import { Injectable } from '@angular/core';
import { CONTENT_MESSAGE } from '@ext/source/constants';
import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';
import { share } from 'rxjs/operators/share';
import { ChromeService } from '../chrome';
import { Notification } from './spy.interfaces';

@Injectable()
export class SpyService {

  public notifications: Observable<Notification>;

  constructor(chromeService: ChromeService) {
    this.notifications = chromeService.messages.pipe(
      filter(message => message.name === CONTENT_MESSAGE),
      map(message => message.params),
      share()
    );
  }
}
