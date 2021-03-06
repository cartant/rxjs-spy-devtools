import { Component, Input, OnInit } from '@angular/core';
import { Pause, PauseCommand, PausePlugin, PauseTeardown, selectPausePluginEntities, State } from '@app/root/spy';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Component({
  selector: 'app-pause',
  templateUrl: './pause.component.html',
  styleUrls: ['./pause.component.scss']
})
export class PauseComponent implements OnInit {

  @Input() public id: string;
  public notifications: Observable<number>;
  public paused: Observable<boolean>;
  public resumed: Observable<boolean>;

  constructor(private _store: Store<State>) {}

  ngOnInit() {
    this.notifications = this._plugin().pipe(
      map(plugin => plugin ? plugin.notifications : 0)
    );
    this.paused = this._plugin().pipe(
      map(plugin => Boolean(plugin && (plugin.state === 'paused')))
    );
    this.resumed = this._plugin().pipe(
      map(plugin => Boolean(!plugin || (plugin.state === 'resumed')))
    );
  }

  pause(): void {
    this._store.dispatch(new Pause(this.id));
  }

  resume(): void {
    this._plugin().pipe(
      first()
    ).subscribe(plugin => this._store.dispatch(new PauseTeardown(this.id, plugin.pluginId)));
  }

  skip(): void {
    this._plugin().pipe(
      first()
    ).subscribe(plugin => this._store.dispatch(new PauseCommand(this.id, plugin.pluginId, 'skip')));
  }

  step(): void {
    this._plugin().pipe(
      first()
    ).subscribe(plugin => this._store.dispatch(new PauseCommand(this.id, plugin.pluginId, 'step')));
  }

  private _plugin(): Observable<PausePlugin> {
    return this._store.select(selectPausePluginEntities).pipe(
      map(entities => entities[this.id])
    );
  }
}
