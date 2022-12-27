import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipelineComponent } from './pipeline.component';
import { PipelineService } from 'src/app/core/services';
import { PipelineRoutingModule } from './pipeline-routing.module';



@NgModule({
    declarations: [
        PipelineComponent
    ],
    imports: [
        PipelineRoutingModule,
        CommonModule
    ],
    providers: [PipelineService]
})
export class PipelineModule { }
