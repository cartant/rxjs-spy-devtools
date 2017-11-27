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

export interface PausePlugin {
  fulfilled: boolean;
  pluginId?: string;
  spyId: string;
  state: 'paused' | 'resumed';
  timestamp: number;
}
export type PausePluginState = EntityState<PausePlugin>;

export const pausePluginAdapter = createEntityAdapter<PausePlugin>({
  selectId: (entity: PausePlugin) => entity.spyId,
  sortComparer: (a, b) => b.timestamp - a.timestamp
});

export const pausePluginReducer = reducer<PausePluginState>([
  on(PluginActions.PauseFulfilled, (state, { spyId }) => pausePluginAdapter.addOne({
    fulfilled: false,
    spyId,
    state: 'paused',
    timestamp: Date.now()
  }, state)),
  on(PluginActions.PauseFulfilled, (state, { pluginId, spyId }) => pausePluginAdapter.updateOne({
    id: spyId,
    changes: { fulfilled: true, pluginId }
  }, state)),
  on(PluginActions.PauseCommand, (state, { spyId }) => pausePluginAdapter.updateOne({
    id: spyId,
    changes: { fulfilled: false }
  }, state)),
  on(PluginActions.PauseCommandFulfilled, (state, { command, pluginId }) => {
    switch (command) {
    case 'pause':
      return pausePluginAdapter.updateOne({ id: pluginId, changes: { state: 'paused' } }, state);
    case 'resume':
      return pausePluginAdapter.updateOne({ id: pluginId, changes: { state: 'resumed' } }, state);
    default:
      return state;
    }
  }),
  on(PluginActions.PauseTeardown, (state, { spyId }) => pausePluginAdapter.updateOne({
    id: spyId,
    changes: { fulfilled: false }
  }, state)),
  on(PluginActions.PauseTeardownFulfilled, (state, { spyId }) => pausePluginAdapter.removeOne(spyId, state))
], pausePluginAdapter.getInitialState({}));

export const selectPausePluginState = createFeatureSelector<PausePluginState>('pausePlugins');
export const {
  selectIds: selectPausePluginIds,
  selectEntities: selectPausePluginEntities,
  selectAll: selectAllPausePlugins
} = pausePluginAdapter.getSelectors(selectPausePluginState);
