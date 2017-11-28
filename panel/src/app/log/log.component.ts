import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import { Log, State } from '@app/root/spy';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {

  constructor(private store_: Store<State>) {}

  ngOnInit() {
  }

  change(event: MatCheckboxChange): void {
  }
}
