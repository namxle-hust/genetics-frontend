import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamplesComponent } from './samples.component';
import { SamplesRoutingModule } from './samples-routing.module';
import { CRUDTableModule } from 'src/app/shared/crud-table';
import { NgSelect2Module } from 'ng-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SampleService } from 'src/app/core/services';
import { CreateSamplesComponent } from './create-samples/create-samples.component';
import { FormatBytesPipe, SampleTypeConverterPipe, UploadFileileStatusConverterPipe } from 'src/app/core/pipes';
import { UploadComponent } from 'src/app/shared/partials/upload/upload.component';
import { ConfirmModalComponent } from 'src/app/shared/partials/confirm-modal/confirm-modal.component';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
    declarations: [
        SamplesComponent,
        CreateSamplesComponent,
        SampleTypeConverterPipe,
        FormatBytesPipe,
        UploadComponent,
        UploadFileileStatusConverterPipe,
        ConfirmModalComponent
    ],
    imports: [
        SamplesRoutingModule,
        CRUDTableModule,
        NgSelect2Module,
        FormsModule,
        ReactiveFormsModule,
        NgbModalModule,
        NgbDatepickerModule,
        CommonModule,
        InlineSVGModule,
        NgbModalModule,
        NgxMaskModule.forRoot()
    ],
    providers: [SampleService]
})
export class SamplesModule { }
