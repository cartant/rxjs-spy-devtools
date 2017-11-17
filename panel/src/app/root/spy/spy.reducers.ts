import { InjectionToken, Provider } from '@angular/core';
import { APP_MAX_NOTIFICATIONS } from '@app/constants';
import { ObservableSnapshot, SubscriberSnapshot, SubscriptionSnapshot } from '@devtools/interfaces';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { on, reducer } from 'ts-action';
import { Connect, Disconnect, Notify, SnapshotFulfilled } from './spy.actions';

export interface Notification {
  id: string;
  notification: string;
  observable: string;
  subscriber: string;
  subscription: string;
  tag: string | null;
  tick: number;
  timestamp: number;
  value?: { json: string };
}
export type NotificationState = EntityState<Notification>;
const notificationAdapter = createEntityAdapter<Notification>({
  sortComparer: (a, b) => b.timestamp - a.timestamp
});
const notificationReducer = reducer<NotificationState>([
  on(Connect, () => notificationAdapter.getInitialState({})),
  on(Disconnect, () => notificationAdapter.getInitialState({})),
  on(Notify, (state, { payload }) => {
    const result = notificationAdapter.addOne({
      id: payload.id,
      notification: payload.notification,
      observable: payload.observable.id,
      subscriber: payload.subscriber.id,
      subscription: payload.subscription.id,
      tag: payload.observable.tag,
      tick: payload.tick,
      timestamp: payload.timestamp,
      value: payload.value
    }, state);
    if (result.ids.length > APP_MAX_NOTIFICATIONS) {
      (result.ids as string[])
        .splice(APP_MAX_NOTIFICATIONS, result.ids.length - APP_MAX_NOTIFICATIONS)
        .forEach(key => { delete result.entities[key]; });
    }
    return result;
  })
], notificationAdapter.getInitialState({}));

export const selectNotificationState = createFeatureSelector<NotificationState>('notifications');
export const {
  selectIds: selectNotificationIds,
  selectEntities: selectNotificationEntities,
  selectAll: selectAllNotifications
} = notificationAdapter.getSelectors(selectNotificationState);

export type ObservableState = EntityState<Partial<ObservableSnapshot>>;
const observableAdapter = createEntityAdapter<Partial<ObservableSnapshot>>({});
const observableReducer = reducer<ObservableState>([
  on(Connect, () => observableAdapter.getInitialState({})),
  on(Disconnect, () => observableAdapter.getInitialState({})),
  on(Notify, (state, { payload }) => observableAdapter.addOne(payload.observable, state)),
  on(SnapshotFulfilled, (state, { payload }) => observableAdapter.addMany(payload.observables, observableAdapter.getInitialState({})))
], observableAdapter.getInitialState({}));

export type SubscriberState = EntityState<Partial<SubscriberSnapshot>>;
const subscriberAdapter = createEntityAdapter<Partial<SubscriberSnapshot>>({});
const subscriberReducer = reducer<SubscriberState>([
  on(Connect, () => subscriberAdapter.getInitialState({})),
  on(Disconnect, () => subscriberAdapter.getInitialState({})),
  on(Notify, (state, { payload }) => subscriberAdapter.addOne(payload.subscriber, state)),
  on(SnapshotFulfilled, (state, { payload }) => subscriberAdapter.addMany(payload.subscribers, subscriberAdapter.getInitialState({})))
], subscriberAdapter.getInitialState({}));

export type SubscriptionState = EntityState<Partial<SubscriptionSnapshot>>;
const subscriptionAdapter = createEntityAdapter<Partial<SubscriptionSnapshot>>({});
const subscriptionReducer = reducer<SubscriptionState>([
  on(Connect, () => subscriptionAdapter.getInitialState({})),
  on(Disconnect, () => subscriptionAdapter.getInitialState({})),
  on(Notify, (state, { payload }) => subscriptionAdapter.addOne(payload.subscription, state)),
  on(SnapshotFulfilled, (state, { payload }) => subscriptionAdapter.addMany(payload.subscriptions, subscriptionAdapter.getInitialState({})))
], subscriptionAdapter.getInitialState({}));

export interface State {
  notifications: NotificationState;
  observables: ObservableState;
  subscribers: SubscriberState;
  subscriptions: SubscriptionState;
}

export const REDUCERS_TOKEN = new InjectionToken<ActionReducerMap<State>>('REDUCERS');

export function getReducers(): ActionReducerMap<State> {
  return {
    notifications: notificationReducer,
    observables: observableReducer,
    subscribers: subscriberReducer,
    subscriptions: subscriptionReducer
  };
}

export function provideReducers(): Provider {
  return {
    provide: REDUCERS_TOKEN,
    useFactory: getReducers
  };
}
