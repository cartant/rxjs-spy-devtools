import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';
import { on, reducer } from 'ts-action';
import * as PluginActions from './plugin.actions';

export interface LogPlugin {
  fulfilled: boolean;
  pluginId?: string;
  spyId: string;
  timestamp: number;
}
export type LogPluginState = EntityState<LogPlugin>;

export const logPluginAdapter = createEntityAdapter<LogPlugin>({
  selectId: (entity: LogPlugin) => entity.spyId,
  sortComparer: (a, b) => b.timestamp - a.timestamp
});

export const logPluginReducer = reducer<LogPluginState>([
  on(PluginActions.Log, (state, { spyId }) => logPluginAdapter.addOne({
    fulfilled: false,
    spyId,
    timestamp: Date.now()
  }, state)),
  on(PluginActions.LogFulfilled, (state, { pluginId, spyId }) => logPluginAdapter.updateOne({
    id: spyId,
    changes: { fulfilled: true, pluginId }
  }, state)),
  on(PluginActions.LogTeardown, (state, { spyId }) => logPluginAdapter.updateOne({
    id: spyId,
    changes: { fulfilled: false }
  }, state)),
  on(PluginActions.LogTeardownFulfilled, (state, { spyId }) => logPluginAdapter.removeOne(spyId, state))
], logPluginAdapter.getInitialState({}));

export const selectLogPluginState = createFeatureSelector<LogPluginState>('logPlugins');
export const {
  selectIds: selectLogPluginIds,
  selectEntities: selectLogPluginEntities,
  selectAll: selectAllLogPlugins
} = logPluginAdapter.getSelectors(selectLogPluginState);