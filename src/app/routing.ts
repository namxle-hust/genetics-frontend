import { Routes } from '@angular/router';
import { AuthGuard } from './modules/auth/services/auth.guard';

const Routing: Routes = [
    {
        path: 'auth',
        loadChildren: () =>
            import('./modules/auth/auth.module').then((m) => m.AuthModule),
    },
    {
        canActivate: [AuthGuard],
        path: 'workspace',
        loadChildren: () =>
            import('./modules/workspaces/workspaces.module').then((m) => m.WorkspacesModule),
    },
    {
        canActivate: [AuthGuard],
        path: 'pipeline',
        loadChildren: () =>
            import('./modules/pipeline/pipeline.module').then((m) => m.PipelineModule)
    },
    {
        canActivate: [AuthGuard],
        path: 'analysis',
        loadChildren: () =>
            import('./modules/analysis/analysis.module').then((m) => m.AnalysisModule)
    },
    {
        canActivate: [AuthGuard],
        path: 'samples',
        loadChildren: () =>
            import('./modules/samples/samples.module').then((m) => m.SamplesModule)
    },
    {
        path: '',
        redirectTo: '/workspace',
        pathMatch: 'full',
    },
    {
        path: '**',
        redirectTo: 'error/404',
    },
];

export { Routing };
