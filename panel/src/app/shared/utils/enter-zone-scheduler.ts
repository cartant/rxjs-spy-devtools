import { NgZone } from '@angular/core';
import { Scheduler } from 'rxjs/Scheduler';
import { async } from 'rxjs/scheduler/async';
import { Subscription } from 'rxjs/Subscription';

export class EnterZoneScheduler {

  constructor(private _zone: NgZone, private _scheduler: Scheduler) {}

  schedule(...args: any[]): Subscription {
    const { _scheduler, _zone } = this;
    return _zone.run(() => _scheduler.schedule.apply(_scheduler, args));
  }
}

export function enterZone(zone: NgZone, scheduler: Scheduler = async): Scheduler {
    return new EnterZoneScheduler(zone, scheduler) as any;
}
