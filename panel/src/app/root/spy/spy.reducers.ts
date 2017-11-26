import { InjectionToken, Provider } from '@angular/core';
import { ActionReducerMap } from '@ngrx/store';
import { Notification, notificationReducer, NotificationState } from './notification/notification.reducers';
import { observableReducer, ObservableState } from './observable/observable.reducers';
import { subscriberReducer, SubscriberState } from './subscriber/subscriber.reducers';
import { subscriptionReducer, SubscriptionState } from './subscription/subscription.reducers';

export * from './notification/notification.reducers';
export * from './observable/observable.reducers';
export * from './subscriber/subscriber.reducers';
export * from './subscription/subscription.reducers';

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
