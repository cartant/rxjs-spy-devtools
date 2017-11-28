import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createFeatureSelector } from '@ngrx/store';
import { on, reducer, union } from 'ts-action';
import * as PluginActions from './plugin.actions';

const Requests = union(
  PluginActions.Log,
  PluginActions.LogTeardown
);

export interface LogPlugin {
  pluginId?: string;
  request?: typeof Requests;
  spyId: string;
  timestamp: number;
}
export type LogPluginState = EntityState<LogPlugin>;

export const logPluginAdapter = createEntityAdapter<LogPlugin>({
  selectId: (entity: LogPlugin) => entity.spyId,
  sortComparer: (a, b) => b.timestamp - a.timestamp
});

export const logPluginReducer = reducer<LogPluginState>([
  on(PluginActions.Log, (state, action) => logPluginAdapter.addOne({
    spyId: action.spyId,
    request: action,
    timestamp: Date.now()
  }, state)),
  on(PluginActions.LogFulfilled, (state, { pluginId, spyId }) => logPluginAdapter.updateOne({
    id: spyId,
    changes: { pluginId, request: undefined }
  }, state)),
  on(PluginActions.LogTeardown, (state, action) => logPluginAdapter.updateOne({
    id: action.spyId,
    changes: { request: action }
  }, state)),
  on(PluginActions.LogTeardownFulfilled, (state, { spyId }) => logPluginAdapter.removeOne(spyId, state))
], logPluginAdapter.getInitialState({}));

export const selectLogPluginState = createFeatureSelector<LogPluginState>('logPlugins');
export const {
  selectIds: selectLogPluginIds,
  selectEntities: selectLogPluginEntities,
  selectAll: selectAllLogPlugins
} = logPluginAdapter.getSelectors(selectLogPluginState);
