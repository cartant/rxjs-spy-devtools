import { InjectionToken, Provider } from '@angular/core';
import { ActionReducerMap } from '@ngrx/store';
import { notificationReducer, NotificationState } from './notification/notification.reducers';
import { observableReducer, ObservableState } from './observable/observable.reducers';
import { logPluginReducer, LogPluginState } from './plugin/log-plugin.reducers';
import { pausePluginReducer, PausePluginState } from './plugin/pause-plugin.reducers';
import { subscriberReducer, SubscriberState } from './subscriber/subscriber.reducers';
import { subscriptionReducer, SubscriptionState } from './subscription/subscription.reducers';

export * from './notification/notification.reducers';
export * from './observable/observable.reducers';
export * from './plugin/log-plugin.reducers';
export * from './plugin/pause-plugin.reducers';
export * from './subscriber/subscriber.reducers';
export * from './subscription/subscription.reducers';

export interface State {
  logPlugins: LogPluginState;
  notifications: NotificationState;
  observables: ObservableState;
  pausePlugins: PausePluginState;
  subscribers: SubscriberState;
  subscriptions: SubscriptionState;
}

export const REDUCERS_TOKEN = new InjectionToken<ActionReducerMap<State>>('REDUCERS');

export function getReducers(): ActionReducerMap<State> {
  return {
    logPlugins: logPluginReducer,
    notifications: notificationReducer,
    observables: observableReducer,
    pausePlugins: pausePluginReducer,
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
