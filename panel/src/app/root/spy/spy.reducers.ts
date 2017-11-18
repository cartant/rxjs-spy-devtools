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
  type: string;
  value?: { json: string };
}
export type NotificationState = EntityState<Notification>;
const notificationAdapter = createEntityAdapter<Notification>({
  sortComparer: (a, b) => b.timestamp - a.timestamp
});
const notificationReducer = reducer<NotificationState>([
  on(Connect, () => notificationAdapter.getInitialState({})),
  on(Disconnect, () => notificationAdapter.getInitialState({})),
  on(Notify, (state, { notification }) => {
    const result = notificationAdapter.addOne({
      id: notification.id,
      notification: notification.notification,
      observable: notification.observable.id,
      subscriber: notification.subscriber.id,
      subscription: notification.subscription.id,
      tag: notification.observable.tag,
      tick: notification.tick,
      timestamp: notification.timestamp,
      type: notification.observable.type,
      value: notification.value
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
  on(Notify, (state, { notification }) =>
    observableAdapter.addOne(notification.observable, state)
  ),
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

export type SubscriberState = EntityState<Partial<SubscriberSnapshot>>;
const subscriberAdapter = createEntityAdapter<Partial<SubscriberSnapshot>>({});
const subscriberReducer = reducer<SubscriberState>([
  on(Connect, () => subscriberAdapter.getInitialState({})),
  on(Disconnect, () => subscriberAdapter.getInitialState({})),
  on(Notify, (state, { notification }) =>
    subscriberAdapter.addOne(notification.subscriber, state)
  ),
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

export type SubscriptionState = EntityState<Partial<SubscriptionSnapshot>>;
const subscriptionAdapter = createEntityAdapter<Partial<SubscriptionSnapshot>>({});
const subscriptionReducer = reducer<SubscriptionState>([
  on(Connect, () => subscriptionAdapter.getInitialState({})),
  on(Disconnect, () => subscriptionAdapter.getInitialState({})),
  on(Notify, (state, { notification }) =>
    subscriptionAdapter.addOne(notification.subscription, state)
  ),
  on(SnapshotFulfilled, (state, { snapshot }) =>
    subscriptionAdapter.addMany(snapshot.subscriptions, subscriptionAdapter.getInitialState({}))
  )
], subscriptionAdapter.getInitialState({}));

export const selectSubscriptionState = createFeatureSelector<SubscriptionState>('subscriptions');
export const {
  selectIds: selectSubscriptionIds,
  selectEntities: selectSubscriptionEntities,
  selectAll: selectAllSubscriptions
} = subscriptionAdapter.getSelectors(selectSubscriptionState);

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
