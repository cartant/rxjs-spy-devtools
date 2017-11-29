import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createFeatureSelector } from '@ngrx/store';
import { on, reducer } from 'ts-action';
import * as PluginActions from './plugin.actions';
import * as ServiceActions from '../service/service.actions';

export interface PausePlugin {
  notifications: number;
  pending: boolean;
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

  on(PluginActions.Pause, (state, { spyId }) => pausePluginAdapter.addOne({
    notifications: 0,
    pending: true,
    spyId,
    state: 'paused',
    timestamp: Date.now()
  }, state)),

  on(PluginActions.PauseFulfilled, (state, { pluginId, spyId }) => pausePluginAdapter.updateOne({
    id: spyId,
    changes: { pending: false, pluginId }
  }, state)),

  on(PluginActions.PauseRejected, (state, { error, request: { spyId } }) => pausePluginAdapter.updateOne({
    id: spyId,
    changes: { pending: false }
  }, state)),

  on(PluginActions.PauseCommand, (state, { spyId }) => pausePluginAdapter.updateOne({
    id: spyId,
    changes: { pending: true }
  }, state)),

  on(PluginActions.PauseCommandFulfilled, (state, { command, spyId }) => {
    switch (command) {
    case 'pause':
      return pausePluginAdapter.updateOne({ id: spyId, changes: { pending: false, state: 'paused' } }, state);
    case 'resume':
      return pausePluginAdapter.updateOne({ id: spyId, changes: { pending: false, state: 'resumed' } }, state);
    default:
      return state;
    }
  }),

  on(PluginActions.PauseCommandRejected, (state, { error, request: { spyId  } }) => pausePluginAdapter.updateOne({
    id: spyId,
    changes: { pending: false }
  }, state)),

  on(PluginActions.PauseTeardown, (state, { spyId }) => pausePluginAdapter.updateOne({
    id: spyId,
    changes: { pending: true }
  }, state)),

  on(PluginActions.PauseTeardownFulfilled, (state, { spyId }) => pausePluginAdapter.removeOne(spyId, state)),

  on(PluginActions.PauseTeardownRejected, (state, { error, request: { spyId  } }) => pausePluginAdapter.updateOne({
    id: spyId,
    changes: { pending: false }
  }, state)),

  on(ServiceActions.BroadcastDeckStats, (state, { stats }) => pausePluginAdapter.updateOne({
    id: stats.id,
    changes: { notifications: stats.notifications }
  }, state))

], pausePluginAdapter.getInitialState({}));

export const selectPausePluginState = createFeatureSelector<PausePluginState>('pausePlugins');
export const {
  selectIds: selectPausePluginIds,
  selectEntities: selectPausePluginEntities,
  selectAll: selectAllPausePlugins
} = pausePluginAdapter.getSelectors(selectPausePluginState);
