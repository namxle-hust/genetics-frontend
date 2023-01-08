import { Component, OnInit, OnDestroy, Input, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { SampleModel, AnalysisModel, WorkspaceModel } from 'src/app/core/models';
import { AnalysisService, SampleService, WorkspaceService } from 'src/app/core/services';
import { GenderEnum, VcfTypeEnum,  } from 'src/app/core/config';
import { VCF_TYPES, GENDERS } from 'src/app/core/constants';
 
@Component({
    selector: 'app-create-analysis',
    templateUrl: './create-analysis.component.html',
    styleUrls: ['./create-analysis.component.scss'],
    providers: [WorkspaceService, SampleService]
})
export class CreateAnalysisComponent implements OnInit, OnDestroy, AfterViewChecked {

    @Input() id: number;

    public vcfTypes = VCF_TYPES;

    public genders = GENDERS;

    public analysis: AnalysisModel;

    public formGroup: FormGroup;

    private subscriptions: Subscription[] = []

    public isLoading$: Observable<boolean>

    public workspaces: WorkspaceModel[] = [];

    public samples: SampleModel[] = [];

    isLoading: boolean = false;


    constructor(
        public modal: NgbActiveModal,
        private toastr: ToastrService,
        private analysisService: AnalysisService,
        private workspaceService: WorkspaceService,
        private sampleService: SampleService,
        private fb: FormBuilder,
    ) {
        // this.isUpbloadReadySubject = new BehaviorSubject<boolean>(true)

        this.isLoading$ = this.analysisService.isLoading$;
        const sb = this.isLoading$.subscribe(value => this.isLoading = value)
        this.subscriptions.push(sb)

    }

    ngOnInit(): void {
        this.loadData();
        this.loadWorkspace();
        this.loadSamples()
    }


    ngAfterViewChecked(): void {
       
    }

    loadData() {
        if (!this.id) {
            this.loadForm();
        } else {
            const sb = this.analysisService.getItemById(this.id).subscribe((analysis: AnalysisModel | undefined) => {
                if (analysis) {
                    this.analysis = analysis;
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

    loadSamples() {
        const sb = this.sampleService.getSamples().subscribe((samples: SampleModel[]) => {
            this.samples = samples;
        })
        this.subscriptions.push(sb);
    }

    loadFormEdit(): void {
        this.formGroup = this.fb.group({
            name: [this.analysis.name, Validators.compose([Validators.required, Validators.maxLength(100)])],
            description: [this.analysis.description, Validators.compose([Validators.maxLength(1000)])]
        })
    }

    loadForm(): void {
        this.formGroup = this.fb.group({
            name: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
            vcfType: [null, Validators.compose([Validators.required])],
            workspace: [null, Validators.compose([Validators.required])],
            sample: [null, Validators.compose([Validators.required])],
            description: ['', Validators.compose([Validators.maxLength(1000)])],
            gender: [null, Validators.compose([Validators.required])]
            

        });
        if (!this.id) {
            this.formGroup.reset();
        }
    }

    get SelectedAnalysisType(): VcfTypeEnum {
        return this.formGroup.value.vcfType
    }

    get SelectedGender(): GenderEnum {
        return this.formGroup.value.gender
    }

    edit() {
        const sb = this.analysisService.update(this.analysis).pipe(
        ).subscribe((response) => {
            if (response) {
                this.toastr.success('Analysis updated successfully!');
                this.modal.close();
            }
        });
        this.subscriptions.push(sb);
    }

    create() {
        const sb = this.analysisService.create(this.analysis).subscribe((response) => {
            if (response) {
                this.toastr.success('Analysis created successfully');
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
            this.analysis.name = formData.name;
            this.analysis.id = this.id

        } else {
            this.analysis = new AnalysisModel();
            this.analysis.name = formData.name;
            this.analysis.vcfType = formData.vcfType;
            this.analysis.workspaceId = parseInt(formData.workspace)
            this.analysis.sampleId = parseInt(formData.sample)
            this.analysis.gender = this.SelectedGender
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sb => sb.unsubscribe())
    }
}




