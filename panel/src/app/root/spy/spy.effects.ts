import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { map } from 'rxjs/operators/map';
import { Notify } from './spy.actions';
import { SpyService } from './spy.service';

@Injectable()
export class SpyEffects {

  @Effect()
  notify = this._spyService.notifications.pipe(map(notification => new Notify(notification)));

  constructor(private _spyService: SpyService, private _actions: Actions) {}
}
