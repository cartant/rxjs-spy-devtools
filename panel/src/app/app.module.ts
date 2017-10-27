import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatSidenavModule, MatTableModule } from '@angular/material';

import { AppComponent } from '@app/app.component';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    MatSidenavModule,
    MatTableModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
