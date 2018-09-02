import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { APP_AUDIT_TIME_INPUT, APP_AUDIT_TIME_OUTPUT } from '@app/constants';
import { selectAllObservables, State } from '@app/root/spy';
import { DataSource } from '@app/shared/utils';
import { ObservableSnapshot } from '@devtools/interfaces';
import { environment } from '@env/environment';
import { Store } from '@ngrx/store';
import { auditTime, combineLatest, map, startWith } from 'rxjs/operators';
import matchSorter, { caseRankings, rankings } from 'match-sorter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-observables',
  templateUrl: './observables.component.html',
  styleUrls: ['./observables.component.scss']
})
export class ObservablesComponent {

  public dataSource: DataSource<Partial<ObservableSnapshot>>;
  public displayedColumns = environment.production ?
    ['tag', 'type', 'log', 'pause'] :
    ['id', 'tag', 'type', 'log', 'pause'];
  public form: FormGroup;

  constructor(formBuilder: FormBuilder, private _store: Store<State>) {
    this.form = formBuilder.group({
      filter: []
    });
    const filterChanges = this.form.valueChanges.pipe(
      auditTime(APP_AUDIT_TIME_INPUT),
      map(form => form.filter),
      startWith(undefined)
    );
    this.dataSource = new DataSource(_store.select(selectAllObservables).pipe(
      auditTime(APP_AUDIT_TIME_OUTPUT),
      map(observables => observables
        .filter(observable => observable.subscriptions.length > 0)
        .reverse()
      ),
      combineLatest(filterChanges, (observables, filter) => filter ?
        matchSorter(observables, filter, { keys: ['tag', 'type'] }) :
        observables
      )
    ));
  }
}
