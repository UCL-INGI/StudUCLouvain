import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

enableProdMode();
if(window){
  window.console.log=function(){};
}
platformBrowserDynamic().bootstrapModule(AppModule);
