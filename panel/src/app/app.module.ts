import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatIconModule,
  MatSidenavModule,
  MatTableModule
} from '@angular/material';

import { AppComponent } from '@app/app.component';
import { RootModule } from '@app/root';
import { SharedModule } from '@app/shared';
import { LogComponent } from './log/log.component';
import { PauseComponent } from './pause/pause.component';

@NgModule({
  declarations: [
    AppComponent,
    LogComponent,
    PauseComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatIconModule,
    MatSidenavModule,
    MatTableModule,
    RootModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
