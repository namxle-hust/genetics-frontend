import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SamplesGuard } from 'src/app/core/guards';
import { SampleDetailComponent } from './sample-detail/sample-detail.component';
import { SamplesComponent } from './samples.component';


export const routes: Routes = [
    {
        path: '',
        component: SamplesComponent
    },
    {
        path: ':id/detail',
        canActivate: [SamplesGuard],
        component: SampleDetailComponent
        
    },
    { path: '**', redirectTo: 'error/404' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SamplesRoutingModule { }
