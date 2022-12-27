import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamplesComponent } from './samples.component';
import { SamplesRoutingModule } from './samples-routing.module';
import { CreateSampleComponent } from './create-sample/create-sample.component';
import { SampleStatusConverterPipe, VcfTypeConverterPipe } from 'src/app/core/pipes/sample.pipe';
import { CRUDTableModule } from 'src/app/shared/crud-table';
import { NgSelect2Module } from 'ng-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SampleService, WorkspaceService } from 'src/app/core/services';



@NgModule({
    declarations: [
        SamplesComponent,
        CreateSampleComponent,
        VcfTypeConverterPipe,
        SampleStatusConverterPipe
    ],
    imports: [
        CommonModule,
        SamplesRoutingModule,
        CRUDTableModule,
        NgSelect2Module,
        FormsModule,
        ReactiveFormsModule,
        NgbDatepickerModule,
        CommonModule,
        InlineSVGModule,
        NgbModalModule
    ],
    providers: [SampleService]
})
export class SamplesModule { }
