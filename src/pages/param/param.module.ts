import { IonicModule } from '@ionic/angular';

import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../app/app.module';
import { ParamPage } from './param';
import { SettingsRoutingModule } from "./param-routing.module";

@NgModule({
  declarations: [ParamPage],
  imports: [
    IonicModule,
    SettingsRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ]
})
export class ParamPageModule {
}
