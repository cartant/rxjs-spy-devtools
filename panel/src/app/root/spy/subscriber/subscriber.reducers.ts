import { SubscriberSnapshot } from '@devtools/interfaces';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';
import { on, reducer } from 'ts-action';
import { BroadcastNotification, Connect, Disconnect, SnapshotFulfilled } from '../service/service.actions';

export type SubscriberState = EntityState<Partial<SubscriberSnapshot>>;

export const subscriberAdapter = createEntityAdapter<Partial<SubscriberSnapshot>>({
  selectId: entity => entity.id
});

export const subscriberReducer = reducer<SubscriberState>([

  on(BroadcastNotification, (state, { notification }) => {
    const id = notification.subscriber.id;
    const previous = state.entities[id];
    const value = {
      tick: notification.tick,
      timestamp: notification.timestamp,
      value: notification.value
    };
    const changes = {
      ...notification.subscriber,
      tick: notification.tick,
      values: previous ? [...previous.values, value] : [value],
      valuesFlushed: previous ? previous.valuesFlushed : 0
    };
    if (changes.values.length > 4) {
      changes.values.splice(0, 1);
      changes.valuesFlushed += 1;
    }
    return previous ?
      subscriberAdapter.updateOne({ id, changes }, state) :
      subscriberAdapter.addOne(changes, state);
  }),

  on(Connect, () => subscriberAdapter.getInitialState({})),

  on(Disconnect, () => subscriberAdapter.getInitialState({})),

  on(SnapshotFulfilled, (state, { snapshot }) =>
    subscriberAdapter.addMany(snapshot.subscribers, subscriberAdapter.getInitialState({}))
  )

], subscriberAdapter.getInitialState({}));

export const selectSubscriberState = createFeatureSelector<SubscriberState>('subscribers');
export const {
  selectIds: selectSubscriberIds,
  selectEntities: selectSubscriberEntities,
  selectAll: selectAllSubscribers
} = subscriberAdapter.getSelectors(selectSubscriberState);
