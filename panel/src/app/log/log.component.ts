import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import { Log, LogPlugin, LogTeardown, selectLogPluginEntities, State } from '@app/root/spy';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {

  public checked: Observable<boolean>;
  @Input() public id: string;
  public indeterminate: Observable<boolean>;

  constructor(private _store: Store<State>) {}

  ngOnInit() {
    this.checked = this._plugin().pipe(
      map(plugin => Boolean(plugin && plugin.logging))
    );
    this.indeterminate = this._plugin().pipe(
      map(plugin => Boolean(plugin && plugin.pending))
    );
  }

  change(event: MatCheckboxChange): void {
    this._plugin().pipe(
      first()
    ).subscribe(plugin => this._store.dispatch(event.checked ?
      new Log(this.id) :
      new LogTeardown(this.id, plugin.pluginId)
    ));
  }

  private _plugin(): Observable<LogPlugin> {
    return this._store.select(selectLogPluginEntities).pipe(
      map(entities => entities[this.id])
    );
  }
}
