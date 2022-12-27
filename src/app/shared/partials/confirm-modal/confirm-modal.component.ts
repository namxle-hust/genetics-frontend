import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-confirm-modal',
    templateUrl: './confirm-modal.component.html',
    styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit, OnDestroy {
    @Input() confirmButtonTitle: string;
    @Input() modalTitle: string;
    @Input() confirmQuestion: string;
    @Input() executingMessage: string;

    isLoadingSubject: BehaviorSubject<boolean>;
    isDeleteSubject: BehaviorSubject<boolean>;

    isLoading$: Observable<boolean>;
    isDelete$: Observable<boolean>;

    private subscriptions: Subscription[] = []

    constructor(public modal: NgbActiveModal) {
        this.isLoadingSubject = new BehaviorSubject<boolean>(false)
        this.isDeleteSubject = new BehaviorSubject<boolean>(false)

        this.isLoading$ = this.isLoadingSubject.asObservable();
        this.isDelete$ = this.isDeleteSubject.asObservable();
    }

    ngOnInit(): void {
    }

    execute(): void {
        this.isDeleteSubject.next(true);
    }


    ngOnDestroy(): void {
        this.subscriptions.forEach(sb => sb.unsubscribe);
    }

}
