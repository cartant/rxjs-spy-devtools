import { ObservableSnapshot } from '@devtools/interfaces';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';
import { on, reducer } from 'ts-action';
import { BroadcastNotification, Connect, Disconnect, SnapshotFulfilled } from '../service/service.actions';
import { subscriptionIdsReducer } from '../subscription/subscription.reducers';

export type ObservableState = EntityState<Partial<ObservableSnapshot>>;

export const observableAdapter = createEntityAdapter<Partial<ObservableSnapshot>>({
  selectId: entity => entity.id
});

export const observableReducer = reducer<ObservableState>([

  on(BroadcastNotification, (state, action) => {
    const { notification } = action;
    const id = notification.observable.id;
    const previous = state.entities[id];
    const changes: Partial<ObservableSnapshot> = {
      ...notification.observable,
      tick: notification.tick
    };
    changes.subscriptions = subscriptionIdsReducer(previous ? previous.subscriptions : [], action);
    return previous ?
      observableAdapter.updateOne({ id, changes }, state) :
      observableAdapter.addOne(changes, state);
  }),

  on(Connect, () => observableAdapter.getInitialState({})),

  on(Disconnect, () => observableAdapter.getInitialState({})),

  on(SnapshotFulfilled, (state, { snapshot }) =>
    observableAdapter.addMany(snapshot.observables, observableAdapter.getInitialState({}))
  )

], observableAdapter.getInitialState({}));

export const selectObservableState = createFeatureSelector<ObservableState>('observables');
export const {
  selectIds: selectObservableIds,
  selectEntities: selectObservableEntities,
  selectAll: selectAllObservables
} = observableAdapter.getSelectors(selectObservableState);
