import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';
import { on, reducer } from 'ts-action';
import * as PluginActions from './plugin.actions';

export interface LogPlugin {
  pluginId: string;
  timestamp: number;
}
export type LogPluginState = EntityState<LogPlugin>;

export const logPluginAdapter = createEntityAdapter<LogPlugin>({
  selectId: (entity: LogPlugin) => entity.pluginId,
  sortComparer: (a, b) => b.timestamp - a.timestamp
});

export const logPluginReducer = reducer<LogPluginState>([
  on(PluginActions.LogFulfilled, (state, { pluginId }) => logPluginAdapter.addOne({
    pluginId,
    timestamp: Date.now()
  }, state)),
  on(PluginActions.LogTeardownFulfilled, (state, { pluginId }) => logPluginAdapter.removeOne(pluginId, state))
], logPluginAdapter.getInitialState({}));

export const selectLogPluginState = createFeatureSelector<LogPluginState>('logPlugins');
export const {
  selectIds: selectLogPluginIds,
  selectEntities: selectLogPluginEntities,
  selectAll: selectAllLogPlugins
} = logPluginAdapter.getSelectors(selectLogPluginState);

export interface PausePlugin {
  pluginId: string;
  state: 'paused' | 'resumed';
  timestamp: number;
}
export type PausePluginState = EntityState<PausePlugin>;

export const pausePluginAdapter = createEntityAdapter<PausePlugin>({
  selectId: (entity: PausePlugin) => entity.pluginId,
  sortComparer: (a, b) => b.timestamp - a.timestamp
});

export const pausePluginReducer = reducer<PausePluginState>([
  on(PluginActions.PauseFulfilled, (state, { pluginId }) => pausePluginAdapter.addOne({
    pluginId,
    state: 'paused',
    timestamp: Date.now()
  }, state)),
  on(PluginActions.PauseCommandFulfilled, (state) => state),
  // commands: clear; pause; resume; skip; step
  // states: paused; resumed
  on(PluginActions.PauseTeardownFulfilled, (state, { pluginId }) => pausePluginAdapter.removeOne(pluginId, state))
], pausePluginAdapter.getInitialState({}));

export const selectPausePluginState = createFeatureSelector<PausePluginState>('pausePlugins');
export const {
  selectIds: selectPausePluginIds,
  selectEntities: selectPausePluginEntities,
  selectAll: selectAllPausePlugins
} = pausePluginAdapter.getSelectors(selectPausePluginState);
