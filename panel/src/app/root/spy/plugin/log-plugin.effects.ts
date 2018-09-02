import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ofType } from 'ts-action-operators';
import * as PluginActions from './plugin.actions';
import { SpyService } from '../spy.service';

@Injectable()
export class LogPluginEffects {

  @Effect()
  public log = this._actions.pipe(
    ofType(PluginActions.Log),
    switchMap(action => this._spyService.request({
      requestType: 'log',
      spyId: action.spyId
    }).pipe(
      map(response => response.error ?
        new PluginActions.LogRejected(response.error.toString(), action) :
        new PluginActions.LogFulfilled(action.spyId, response['pluginId'])
      ),
      catchError(error => of(new PluginActions.LogRejected(error.toString(), action)))
    ))
  );

  @Effect()
  public logTeardown = this._actions.pipe(
    ofType(PluginActions.LogTeardown),
    switchMap(action => this._spyService.request({
      pluginId: action.pluginId,
      requestType: 'log-teardown'
    }).pipe(
      map(response => response.error ?
        new PluginActions.LogTeardownRejected(response.error.toString(), action) :
        new PluginActions.LogTeardownFulfilled(action.spyId, response['pluginId'])
      ),
      catchError(error => of(new PluginActions.LogTeardownRejected(error.toString(), action)))
    ))
  );

  constructor(private _spyService: SpyService, private _actions: Actions) {}
}
