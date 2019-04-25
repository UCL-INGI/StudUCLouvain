import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
//import { Http } from '@angular/http';
import { HttpLoaderFactory } from '../../app.module'
import { HttpClient } from '@angular/common/http';
import { ParamPage } from './param';


@NgModule({
  declarations: [ParamPage],
  imports: [
  	IonicModule,
  	TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
  ]
})
export class ParamPageModule { }