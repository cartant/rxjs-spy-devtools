import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '@env/environment';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { ChromeService } from './chrome';
import { EFFECTS, provideReducers, REDUCERS_TOKEN, SpyService } from './spy';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot(REDUCERS_TOKEN),
    StoreDevtoolsModule.instrument({}),
    EffectsModule.forRoot(EFFECTS)
  ],
  declarations: [],
  providers: [
    ChromeService.forRoot(),
    provideReducers(),
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
