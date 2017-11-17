import { Injectable } from '@angular/core';
import { MESSAGE_CONNECT, MESSAGE_DISCONNECT } from '@devtools/constants';
import { Actions, Effect } from '@ngrx/effects';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';
import { Connect, Disconnect, Notify } from './spy.actions';
import { SpyService } from './spy.service';

@Injectable()
export class SpyEffects {

  @Effect()
  connect = this._spyService.posts.pipe(filter(post => post.messageType === MESSAGE_CONNECT), map(connect => new Connect()));

  @Effect()
  disconnect = this._spyService.posts.pipe(filter(post => post.messageType === MESSAGE_DISCONNECT), map(connect => new Disconnect()));

  @Effect()
  notify = this._spyService.notifications.pipe(map(notification => new Notify(notification)));

  constructor(private _spyService: SpyService, private _actions: Actions) {}
}
