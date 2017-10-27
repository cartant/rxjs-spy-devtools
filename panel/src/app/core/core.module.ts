import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '@env/environment';
import { ChromeMockService, ChromeService } from './chrome';

const service = ChromeService;

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [service]
})
export class CoreModule {

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule.');
    }
  }
}