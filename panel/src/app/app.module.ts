import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatCheckboxModule,
  MatChipsModule,
  MatIconModule,
  MatSidenavModule,
  MatTableModule,
  MatTabsModule
} from '@angular/material';

import { AppComponent } from '@app/app.component';
import { RootModule } from '@app/root';
import { SharedModule } from '@app/shared';
import { LogComponent } from './log/log.component';
import { PauseComponent } from './pause/pause.component';
import { ObservablesComponent } from './observables/observables.component';
import { NotificationsComponent } from './notifications/notifications.component';

@NgModule({
  declarations: [
    AppComponent,
    LogComponent,
    PauseComponent,
    ObservablesComponent,
    NotificationsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule,
    MatSidenavModule,
    MatTableModule,
    MatTabsModule,
    RootModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
