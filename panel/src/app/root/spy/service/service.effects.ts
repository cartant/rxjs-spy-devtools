import { Injectable } from '@angular/core';
import { MESSAGE_CONNECT, MESSAGE_DISCONNECT } from '@devtools/constants';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { switchMap } from 'rxjs/operators/switchMap';
import { ofType } from 'ts-action-operators';
import { Connect, Disconnect, Notify, Snapshot, SnapshotFulfilled, SnapshotRejected } from './service.actions';
import { SpyService } from '../spy.service';

@Injectable()
export class ServiceEffects {

  @Effect()
  public connect = this._spyService.posts.pipe(
    filter(post => post.messageType === MESSAGE_CONNECT),
    mergeMap(() => [new Connect(), new Snapshot()])
  );

  @Effect()
  public disconnect = this._spyService.posts.pipe(
    filter(post => post.messageType === MESSAGE_DISCONNECT),
    map(() => new Disconnect())
  );

  @Effect()
  public notify = this._spyService.notifications.pipe(
    map(notification => new Notify(notification))
  );

  @Effect()
  public snapshot = this._actions.pipe(
    ofType(Snapshot),
    switchMap(action => this._spyService.request({ requestType: 'snapshot' }).pipe(
      map(response => response.error ?
        new SnapshotRejected(response.error.toString(), action) :
        new SnapshotFulfilled(response['snapshot'])
      ),
      catchError(error => of(new SnapshotRejected(error.toString(), action)))
    ))
  );

  constructor(private _spyService: SpyService, private _actions: Actions) {}
}
