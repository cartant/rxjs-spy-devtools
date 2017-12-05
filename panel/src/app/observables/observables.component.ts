import { ChangeDetectionStrategy, Component } from '@angular/core';
import { APP_AUDIT_TIME } from '@app/constants';
import { selectAllObservables, State } from '@app/root/spy';
import { DataSource } from '@app/shared/utils';
import { ObservableSnapshot } from '@devtools/interfaces';
import { Store } from '@ngrx/store';
import { auditTime } from 'rxjs/operators/auditTime';
import { map } from 'rxjs/operators/map';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-observables',
  templateUrl: './observables.component.html',
  styleUrls: ['./observables.component.scss']
})
export class ObservablesComponent {

  public dataSource: DataSource<Partial<ObservableSnapshot>>;
  public displayedColumns = ['id', 'tag', 'type', 'log', 'pause'];

  constructor(private _store: Store<State>) {
    this.dataSource = new DataSource(_store.select(selectAllObservables).pipe(
      auditTime(APP_AUDIT_TIME),
      map(observables => observables.filter(observable => observable.subscriptions.length > 0))
    ));
  }
}
