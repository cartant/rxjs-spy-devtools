import { NgZone } from '@angular/core';
import { asyncScheduler, SchedulerLike, Subscription } from 'rxjs';

export class EnterZoneScheduler {

  constructor(private _zone: NgZone, private _scheduler: SchedulerLike) {}

  schedule(...args: any[]): Subscription {
    const { _scheduler, _zone } = this;
    return _zone.run(() => _scheduler.schedule.apply(_scheduler, args));
  }
}

export function enterZone(zone: NgZone, scheduler: SchedulerLike = asyncScheduler): SchedulerLike {
    return new EnterZoneScheduler(zone, scheduler) as any;
}
