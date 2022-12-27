import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, catchError, first, Observable, of, Subscription, tap } from 'rxjs';
import { WorkspaceModel } from 'src/app/core/models';
import { WorkspaceService } from 'src/app/core/services';

@Component({
    selector: 'app-edit-workspace',
    templateUrl: './edit-workspace.component.html',
    styleUrls: ['./edit-workspace.component.scss']
})
export class EditWorkspaceComponent implements OnInit, OnDestroy {

    @Input() id: number;

    private workspace: WorkspaceModel;

    public formGroup: FormGroup;

    private subscriptions: Subscription[] = []

    public isLoading$: Observable<boolean>

    isLoading: boolean = false;

    constructor(
        public modal: NgbActiveModal,
        private toastr: ToastrService,
        private workSpacesService: WorkspaceService,
        private fb: FormBuilder,
    ) {
        this.isLoading$ = this.workSpacesService.isLoading$;
        const sb = this.isLoading$.subscribe(value => this.isLoading = value)
        this.subscriptions.push(sb)
    }

    ngOnInit(): void {
        this.loadWorkspace();
    }


    loadWorkspace() {
        if (!this.id) {
            this.loadForm();
        } else {
            const sb = this.workSpacesService.getItemById(this.id).subscribe((workspace: WorkspaceModel | undefined) => {
                if (workspace) {
                    this.workspace = workspace;
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
            name: [this.workspace.name, Validators.compose([Validators.required, Validators.maxLength(100)])]
        })
    }

    loadForm(): void {
        this.formGroup = this.fb.group({
            name: [null, Validators.compose([Validators.required, Validators.maxLength(100)])]
        });
        if (!this.id) {
            this.formGroup.reset();
        }
    }

    edit() {
        const sb = this.workSpacesService.update(this.workspace).pipe(
        ).subscribe((response) => {
            if (response) {
                this.toastr.success('Workspace updated successfully!');
                this.modal.close();
            }
        });
        this.subscriptions.push(sb);
    }

    create() {
        const sb = this.workSpacesService.create(this.workspace).subscribe((response) => {
            if (response) {
                this.toastr.success('Workspace created successfully');
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
        this.prepareWorkspace();
        if (this.id) {
            this.edit()
        } else {
            this.create()
        }
    }

    private prepareWorkspace() {
        const formData = this.formGroup.value;
        this.workspace = new WorkspaceModel()
        this.workspace.name = formData.name;
        this.workspace.id = this.id
    }
    ngOnDestroy(): void {
        this.subscriptions.forEach(sb => sb.unsubscribe())
    }
}


