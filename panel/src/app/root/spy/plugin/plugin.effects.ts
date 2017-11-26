import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { switchMap } from 'rxjs/operators/switchMap';
import { ofType } from 'ts-action-operators';
import * as PluginActions from './plugin.actions';
import { SpyService } from '../spy.service';

@Injectable()
export class PluginEffects {

  @Effect()
  public log = this._actions.pipe(
    ofType(PluginActions.Log),
    switchMap(action => this._spyService.request({
      match: action.id,
      requestType: 'log'
    }).pipe(
      map(response => response.error ?
        new PluginActions.LogRejected(response.error.toString(), action) :
        new PluginActions.LogFulfilled(response['pluginId'])
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
        new PluginActions.LogTeardownFulfilled(response['pluginId'])
      ),
      catchError(error => of(new PluginActions.LogTeardownRejected(error.toString(), action)))
    ))
  );

  @Effect()
  public pause = this._actions.pipe(
    ofType(PluginActions.Pause),
    switchMap(action => this._spyService.request({
      match: action.id,
      requestType: 'pause'
    }).pipe(
      map(response => response.error ?
        new PluginActions.PauseRejected(response.error.toString(), action) :
        new PluginActions.PauseFulfilled(response['pluginId'])
      ),
      catchError(error => of(new PluginActions.PauseRejected(error.toString(), action)))
    ))
  );

  @Effect()
  public pauseCommand = this._actions.pipe(
    ofType(PluginActions.PauseCommand),
    switchMap(action => this._spyService.request({
      command: action.command,
      pluginId: action.pluginId,
      requestType: 'pause-command'
    }).pipe(
      map(response => response.error ?
        new PluginActions.PauseCommandRejected(response.error.toString(), action) :
        new PluginActions.PauseCommandFulfilled(response['pluginId'], action.command)
      ),
      catchError(error => of(new PluginActions.PauseCommandRejected(error.toString(), action)))
    ))
  );

  @Effect()
  public pauseTeardown = this._actions.pipe(
    ofType(PluginActions.PauseTeardown),
    switchMap(action => this._spyService.request({
      pluginId: action.pluginId,
      requestType: 'pause-teardown'
    }).pipe(
      map(response => response.error ?
        new PluginActions.PauseTeardownRejected(response.error.toString(), action) :
        new PluginActions.PauseTeardownFulfilled(response['pluginId'])
      ),
      catchError(error => of(new PluginActions.PauseTeardownRejected(error.toString(), action)))
    ))
  );

  constructor(private _spyService: SpyService, private _actions: Actions) {}
}
