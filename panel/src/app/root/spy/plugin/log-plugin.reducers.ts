import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';
import { on, reducer } from 'ts-action';
import * as PluginActions from './plugin.actions';

export interface LogPlugin {
  logging: boolean;
  pending: boolean;
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
    logging: true,
    pending: true,
    spyId: spyId,
    timestamp: Date.now()
  }, state)),

  on(PluginActions.LogFulfilled, (state, { pluginId, spyId }) => logPluginAdapter.updateOne({
    id: spyId,
    changes: { pending: false, pluginId }
  }, state)),

  on(PluginActions.LogRejected, (state, { error, request: { spyId } }) => logPluginAdapter.updateOne({
    id: spyId,
    changes: { logging: false, pending: false }
  }, state)),

  on(PluginActions.LogTeardown, (state, { spyId }) => logPluginAdapter.updateOne({
    id: spyId,
    changes: { logging: false, pending: true }
  }, state)),

  on(PluginActions.LogTeardownFulfilled, (state, { spyId }) => logPluginAdapter.removeOne(spyId, state)),

  on(PluginActions.LogTeardownRejected, (state, { error, request: { spyId } }) => logPluginAdapter.updateOne({
    id: spyId,
    changes: { pending: false }
  }, state))

], logPluginAdapter.getInitialState({}));

export const selectLogPluginState = createFeatureSelector<LogPluginState>('logPlugins');
export const {
  selectIds: selectLogPluginIds,
  selectEntities: selectLogPluginEntities,
  selectAll: selectAllLogPlugins
} = logPluginAdapter.getSelectors(selectLogPluginState);
