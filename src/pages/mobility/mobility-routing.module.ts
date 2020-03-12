import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MobilityPage } from './mobility';

const routes: Routes = [
    {path: '', component: MobilityPage},
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class MobilityRoutingModule {
}
