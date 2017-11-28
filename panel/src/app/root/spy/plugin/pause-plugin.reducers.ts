import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createFeatureSelector } from '@ngrx/store';
import { on, reducer, union } from 'ts-action';
import * as PluginActions from './plugin.actions';

const Requests = union(
  PluginActions.Pause,
  PluginActions.PauseCommand,
  PluginActions.PauseTeardown
);

export interface PausePlugin {
  pluginId?: string;
  request?: typeof Requests;
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
  on(PluginActions.Pause, (state, action) => pausePluginAdapter.addOne({
    request: action,
    spyId: action.spyId,
    state: 'paused',
    timestamp: Date.now()
  }, state)),
  on(PluginActions.PauseFulfilled, (state, action) => pausePluginAdapter.updateOne({
    id: action.spyId,
    changes: { pluginId: action.pluginId, request: undefined }
  }, state)),
  on(PluginActions.PauseCommand, (state, { spyId }) => pausePluginAdapter.updateOne({
    id: spyId,
    changes: { request: undefined }
  }, state)),
  on(PluginActions.PauseCommandFulfilled, (state, { command, spyId }) => {
    switch (command) {
    case 'pause':
      return pausePluginAdapter.updateOne({ id: spyId, changes: { state: 'paused' } }, state);
    case 'resume':
      return pausePluginAdapter.updateOne({ id: spyId, changes: { state: 'resumed' } }, state);
    default:
      return state;
    }
  }),
  on(PluginActions.PauseTeardown, (state, action) => pausePluginAdapter.updateOne({
    id: action.spyId,
    changes: { request: action }
  }, state)),
  on(PluginActions.PauseTeardownFulfilled, (state, { spyId }) => pausePluginAdapter.removeOne(spyId, state))
], pausePluginAdapter.getInitialState({}));

export const selectPausePluginState = createFeatureSelector<PausePluginState>('pausePlugins');
export const {
  selectIds: selectPausePluginIds,
  selectEntities: selectPausePluginEntities,
  selectAll: selectAllPausePlugins
} = pausePluginAdapter.getSelectors(selectPausePluginState);
