import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditPage } from './credit';

const routes: Routes = [
    {path: '', component: CreditPage},
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class CreditsRoutingModule {
}
