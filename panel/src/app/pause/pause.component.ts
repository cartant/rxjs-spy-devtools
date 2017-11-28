import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Pause, State } from '@app/root/spy';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-pause',
  templateUrl: './pause.component.html',
  styleUrls: ['./pause.component.scss']
})
export class PauseComponent implements OnInit {

  constructor(private store_: Store<State>) {}

  ngOnInit() {
  }
}
