import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '@env/environment';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { ChromeService } from './chrome';
import { EFFECTS, provideReducers, REDUCERS_TOKEN, SpyService } from './spy';

// The Redux DevTools are not usable when the panel is running inside the
// DevTools - only when it's running in a normal page using the mock - so there
// is no point in loading them.

const pageModules: any[] = [];
if ((typeof chrome === 'undefined') || !chrome || !chrome.devtools) {
  pageModules.push(StoreDevtoolsModule.instrument({ maxAge: 10 }));
}

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot(REDUCERS_TOKEN),
    ...pageModules,
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
