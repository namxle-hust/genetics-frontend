import { Component, OnInit, OnDestroy, Input, AfterContentInit, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { BatchModel, SampleModel, WorkspaceModel } from 'src/app/core/models';
import { BatchService, SampleService, WorkspaceService } from 'src/app/core/services';
import { GenderEnum, VcfTypeEnum,  } from 'src/app/core/config';
import { VCF_TYPES, GENDERS } from 'src/app/core/constants';
 
@Component({
    selector: 'app-create-sample',
    templateUrl: './create-sample.component.html',
    styleUrls: ['./create-sample.component.scss'],
    providers: [WorkspaceService, BatchService]
})
export class CreateSampleComponent implements OnInit, OnDestroy, AfterViewChecked {

    @Input() id: number;

    public vcfTypes = VCF_TYPES;

    public genders = GENDERS;

    public sample: SampleModel;

    public formGroup: FormGroup;

    private subscriptions: Subscription[] = []

    public isLoading$: Observable<boolean>

    public workspaces: WorkspaceModel[] = [];

    public batches: BatchModel[] = [];

    isLoading: boolean = false;


    constructor(
        public modal: NgbActiveModal,
        private toastr: ToastrService,
        private sampleService: SampleService,
        private workspaceService: WorkspaceService,
        private batchService: BatchService,
        private fb: FormBuilder,
    ) {
        // this.isUpbloadReadySubject = new BehaviorSubject<boolean>(true)

        this.isLoading$ = this.sampleService.isLoading$;
        const sb = this.isLoading$.subscribe(value => this.isLoading = value)
        this.subscriptions.push(sb)

    }

    ngOnInit(): void {
        this.loadData();
        this.loadWorkspace();
        this.loadBatches()
    }


    ngAfterViewChecked(): void {
       
    }

    loadData() {
        if (!this.id) {
            this.loadForm();
        } else {
            const sb = this.sampleService.getItemById(this.id).subscribe((sample: SampleModel | undefined) => {
                if (sample) {
                    this.sample = sample;
                    this.loadFormEdit();
                } else {
                    this.modal.dismiss();
                }
            });
            this.subscriptions.push(sb);
        }
    }

    loadWorkspace() {
        const sb = this.workspaceService.getWorkspaces().subscribe((workspaces: WorkspaceModel[]) => {
            this.workspaces = workspaces;
        })
        this.subscriptions.push(sb);
    }

    loadBatches() {
        const sb = this.batchService.getBatches().subscribe((batches: BatchModel[]) => {
            this.batches = batches;
        })
        this.subscriptions.push(sb);
    }

    loadFormEdit(): void {
        this.formGroup = this.fb.group({
            name: [this.sample.name, Validators.compose([Validators.required, Validators.maxLength(100)])],
            description: [this.sample.description, Validators.compose([Validators.maxLength(1000)])]
        })
    }

    loadForm(): void {
        this.formGroup = this.fb.group({
            name: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
            vcfType: [null, Validators.compose([Validators.required])],
            workspace: [null, Validators.compose([Validators.required])],
            batch: [null, Validators.compose([Validators.required])],
            description: ['', Validators.compose([Validators.maxLength(1000)])],
            gender: [null, Validators.compose([Validators.required])]
            

        });
        if (!this.id) {
            this.formGroup.reset();
        }
    }

    get SelectedSampleType(): VcfTypeEnum {
        return this.formGroup.value.vcfType
    }

    get SelectedGender(): GenderEnum {
        return this.formGroup.value.gender
    }

    edit() {
        const sb = this.sampleService.update(this.sample).pipe(
        ).subscribe((response) => {
            if (response) {
                this.toastr.success('Batch File updated successfully!');
                this.modal.close();
            }
        });
        this.subscriptions.push(sb);
    }

    create() {
        const sb = this.sampleService.create(this.sample).subscribe((response) => {
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
            this.sample.name = formData.name;
            this.sample.id = this.id

        } else {
            this.sample = new SampleModel();
            this.sample.name = formData.name;
            this.sample.vcfType = formData.vcfType;
            this.sample.workspaceId = parseInt(formData.workspace)
            this.sample.batchId = parseInt(formData.batch)
            this.sample.gender = this.SelectedGender
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sb => sb.unsubscribe())
    }
}




