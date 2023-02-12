import { Component, OnInit, OnDestroy, Input, AfterContentInit, AfterViewChecked } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { SampleModel, FileCreate, FileCreateType } from 'src/app/core/models';
import { SampleService, UploadService } from 'src/app/core/services';
import { SampleTypeEnum } from 'src/app/core/config';
import { ETHNICITIES, GENDERS, SAMPLE_TYPES } from 'src/app/core/constants';
import { lengthArray, minLengthArray } from 'src/app/core/validators';

@Component({
    selector: 'app-create-samples',
    templateUrl: './create-samples.component.html',
    styleUrls: ['./create-samples.component.scss'],
    providers: [UploadService]
})
export class CreateSamplesComponent implements OnInit, OnDestroy, AfterViewChecked {

    @Input() id: number;

    public ethnicities = ETHNICITIES;
    public genders = GENDERS;
    public sampleTypes = SAMPLE_TYPES;

    public sample: SampleModel;

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


    private sampleTypeChangeSubject: BehaviorSubject<boolean>
    public sampleTypeChange$: Observable<boolean>

    constructor(
        public modal: NgbActiveModal,
        private toastr: ToastrService,
        private uploadService: UploadService,
        private sampleService: SampleService,
        private fb: FormBuilder,
    ) {
        // this.isUpbloadReadySubject = new BehaviorSubject<boolean>(true)

        this.isLoading$ = this.sampleService.isLoading$;
        const sb = this.isLoading$.subscribe(value => this.isLoading = value)
        this.subscriptions.push(sb)


        this.sampleTypeChangeSubject = new BehaviorSubject(false)
        this.sampleTypeChange$ = this.sampleTypeChangeSubject.asObservable()

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
        this.sampleTypeChangeSubject.next(true);
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
            this.loadFormEdit()
            const sb = this.sampleService.getItemById(this.id).subscribe((sample: SampleModel | undefined) => {
                if (sample) {
                    this.sample = sample;
                    this.updateFormEdit();
                } else {
                    this.modal.dismiss();
                }
            });
            this.subscriptions.push(sb);
        }
    }

    updateFormEdit() {
        this.formGroup.setValue({
            name: this.sample.name,
            firstName: this.sample.firstName,
            lastName: this.sample.lastName,
            dob: this.sample.dob,
            ethnicity: this.sample.ethnicity,
            gender: this.sample.gender
        })
    }

    loadFormEdit(): void {
        this.formGroup = this.fb.group({
            name: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
            firstName: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
            lastName: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
            dob: [null, Validators.compose([Validators.nullValidator, Validators.required, dobRangeValidator])],
            ethnicity: [null, Validators.required],
            gender: [null, Validators.required]

        })
    }

    loadForm(): void {
        this.formGroup = this.fb.group({
            name: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
            type: [null, Validators.compose([Validators.required])],
            files: [null],
            firstName: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
            lastName: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
            dob: [null, Validators.compose([Validators.nullValidator, Validators.required, dobRangeValidator])],
            ethnicity: [null, Validators.required],
            gender: [null, Validators.required]
        });
        if (!this.id) {
            this.formGroup.reset();
        }
    }

    get SelectedSampleType(): SampleTypeEnum {
        return this.formGroup.value.type
    }

    edit() {
        const sb = this.sampleService.update(this.sample).pipe(
        ).subscribe((response) => {
            if (response) {
                this.toastr.success('Sample updated successfully!');
                this.modal.close();
            }
        });
        this.subscriptions.push(sb);
    }

    create() {
        const sb = this.sampleService.create(this.sample).subscribe((response) => {
            if (response) {
                this.toastr.success('Sample created successfully');
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
        console.log(this.sample);
    }

    private prepareData() {
        const formData = this.formGroup.value;
        if (this.id) {
            this.sample.name = formData.name;
            this.sample.id = this.id
            this.sample.firstName = formData.firstName;
            this.sample.lastName = formData.lastName;
            this.sample.dob = formData.dob;
            this.sample.gender = formData.gender;
            this.sample.ethnicity = formData.ethnicity;

        } else {
            this.sample = new SampleModel();
            this.sample.name = formData.name;
            this.sample.type = formData.type;
            this.sample.firstName = formData.firstName;
            this.sample.lastName = formData.lastName;
            this.sample.dob = formData.dob;
            this.sample.gender = formData.gender;
            this.sample.ethnicity = formData.ethnicity;
            this.sample.files = this.uploadedFiles ? this.uploadedFiles : [];
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sb => sb.unsubscribe())
    }
}


function dobRangeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    let dob = control.value;
    console.log(dob);
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dob)) {
        return { 'dobInvalid': true };
    }

    // Parse the date parts to integers
    var parts = dob.split("/");
    var month = parseInt(parts[0], 10);
    var day = parseInt(parts[1], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if (year < 1900 || year > 2030 || month == 0 || month > 12) {
        return { 'dobRange': true };
    }

    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Adjust for leap years
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
        monthLength[1] = 29;
    }

    // Check the range of the day
    return (day > 0 && day <= monthLength[month - 1]) ? null : { 'dobRange': true };
}