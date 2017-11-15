import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '@env/environment';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ChromeMockService, ChromeService } from './chrome';
import { SpyService } from './spy';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([])
  ],
  declarations: [],
  providers: [
    ChromeService,
    SpyService
  ]
})
export class RootModule {

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: RootModule
  ) {
    if (parentModule) {
      throw new Error('RootModule is already loaded. Import only in AppModule.');
    }
  }
}
