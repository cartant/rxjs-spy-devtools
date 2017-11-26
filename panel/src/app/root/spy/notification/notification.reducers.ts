import { APP_MAX_NOTIFICATIONS } from '@app/constants';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';
import { on, reducer } from 'ts-action';
import { Connect, Disconnect, Notify } from '../service/service.actions';

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

export const notificationAdapter = createEntityAdapter<Notification>({
  selectId: (entity: Notification) => entity.id,
  sortComparer: (a, b) => b.timestamp - a.timestamp
});

export const notificationReducer = reducer<NotificationState>([
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
