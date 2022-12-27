import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/services/auth.guard';
import { PipelineComponent } from './pipeline.component';

export const routes: Routes = [
    {
        canActivate: [AuthGuard],
        path: '',
        component: PipelineComponent
    },
    { path: '**', redirectTo: 'error/404' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PipelineRoutingModule { }
