import { IonicPageModule } from 'ionic-angular';

import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

//import { Http } from '@angular/http';
import { HttpLoaderFactory } from '../../app/app.module';
import { ParamPage } from './param';

@NgModule({
  declarations: [ParamPage],
  imports: [
    IonicPageModule.forChild(ParamPage),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ]
})
export class ParamPageModule {}
