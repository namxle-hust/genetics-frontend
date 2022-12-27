import { Component, OnInit, OnDestroy, Input, AfterContentInit, AfterViewChecked } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { BatchModel, FileCreate, FileCreateType } from 'src/app/core/models';
import { BatchService, UploadService } from 'src/app/core/services';
import { SampleTypeEnum, SAMPLE_TYPES } from 'src/app/core/config';
import { lengthArray, minLengthArray } from 'src/app/core/validators';

@Component({
    selector: 'app-create-batch-files',
    templateUrl: './create-batch-files.component.html',
    styleUrls: ['./create-batch-files.component.scss'],
    providers: [UploadService]
})
export class CreateBatchFilesComponent implements OnInit, OnDestroy, AfterViewChecked {

    @Input() id: number;

    public sampleTypes = SAMPLE_TYPES;

    public batchFile: BatchModel;

    public formGroup: FormGroup;

    private subscriptions: Subscription[] = []

    public isLoading$: Observable<boolean>

    isLoading: boolean = false;

    // public isUploadReady$: Observable<boolean>
    // private isUpbloadReadySubject: BehaviorSubject<boolean>;

    public isUploadReady: boolean = true;

    private uploadedFiles: FileCreate[] = [];

    // private isAllowSubmitSubject: BehaviorSubject<boolean>;
    // public isAllowSubmit$: Observable<boolean>;

    constructor(
        public modal: NgbActiveModal,
        private toastr: ToastrService,
        private uploadService: UploadService,
        private batchService: BatchService,
        private fb: FormBuilder,
    ) {
        // this.isUpbloadReadySubject = new BehaviorSubject<boolean>(true)

        this.isLoading$ = this.batchService.isLoading$;
        const sb = this.isLoading$.subscribe(value => this.isLoading = value)
        this.subscriptions.push(sb)


    }

    ngOnInit(): void {
        this.loadData();
        if (!this.id) {
            const sb = this.uploadService.listFileUploaded$.subscribe((files: FileCreateType) => {
                if (!files) {
                    this.isUploadReady = false
                    this.uploadedFiles = [];
                    return;
                } else {
                    this.isUploadReady = true
                    this.uploadedFiles = files;
                    console.log(this.uploadedFiles);
                    this.setFormFileUpload();
                }
            })
            this.subscriptions.push(sb);
        }
    }


    ngAfterViewChecked(): void {

    }

    setFormFileUpload(): void {
        if (this.uploadedFiles.length > 0) {
            this.uploadedFiles.forEach(file => {
                (< FormArray>this.formGroup.controls.files).push(new FormControl())
            })
        }
    }

    onSampleTypeChange() {
        console.log(this.formGroup.value.type);
        if (this.formGroup.value.type == SampleTypeEnum.FASTQ) {
            this.formGroup.setControl('files', this.fb.array([], lengthArray(2)))
        } else if (this.formGroup.value.type == SampleTypeEnum.VCF) {
            this.formGroup.setControl('files', this.fb.array([], lengthArray(1)))
        }
    }

    loadData() {
        if (!this.id) {
            this.loadForm();
        } else {
            const sb = this.batchService.getItemById(this.id).subscribe((batchFile: BatchModel | undefined) => {
                if (batchFile) {
                    this.batchFile = batchFile;
                    this.loadFormEdit();
                } else {
                    this.modal.dismiss();
                }
            });
            this.subscriptions.push(sb);
        }
    }

    loadFormEdit(): void {
        this.formGroup = this.fb.group({
            name: [this.batchFile.name, Validators.compose([Validators.required, Validators.maxLength(100)])]
        })
    }

    loadForm(): void {
        this.formGroup = this.fb.group({
            name: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
            type: [null, Validators.compose([Validators.required])],
            files: [null]
        });
        if (!this.id) {
            this.formGroup.reset();
        }
    }

    get SelectedSampleType(): SampleTypeEnum {
        return this.formGroup.value.type
    }

    edit() {
        const sb = this.batchService.update(this.batchFile).pipe(
        ).subscribe((response) => {
            if (response) {
                this.toastr.success('Batch File updated successfully!');
                this.modal.close();
            }
        });
        this.subscriptions.push(sb);
    }

    create() {
        const sb = this.batchService.create(this.batchFile).subscribe((response) => {
            if (response) {
                this.toastr.success('Batch File created successfully');
                this.modal.close()
            }
        });
        this.subscriptions.push(sb);
    }

    isControlValid(controlName: string): boolean {
        const control = this.formGroup.controls[controlName];
        return control.valid && (control.dirty || control.touched);
    }

    isControlInvalid(controlName: string): boolean {
        const control = this.formGroup.controls[controlName];
        return control.invalid && (control.dirty || control.touched);
    }

    controlHasError(validation: string, controlName: string): boolean {
        const control = this.formGroup.controls[controlName];
        return control.hasError(validation) && (control.dirty || control.touched);
    }

    isControlTouched(controlName: string): boolean {
        const control = this.formGroup.controls[controlName];
        return control.dirty || control.touched;
    }

    save() {
        this.prepareData();
        if (this.id) {
            this.edit()
        } else {
            this.create()
        }
    }

    private prepareData() {
        const formData = this.formGroup.value;
        if (this.id) {
            this.batchFile.name = formData.name;
            this.batchFile.id = this.id

        } else {
            this.batchFile = new BatchModel();
            this.batchFile.name = formData.name;
            this.batchFile.type = formData.type;
            this.batchFile.files = this.uploadedFiles ? this.uploadedFiles : [];
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sb => sb.unsubscribe())
    }
}


