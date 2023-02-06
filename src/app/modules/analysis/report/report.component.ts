import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { IPgxReportData, IReportData, ISample } from 'src/app/core/models';
import { ReportService } from 'src/app/core/services';

@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnDestroy {

    @Input() analysisId: number

    private subscriptions: Subscription[] = [];

    categories: string[] = [];

    pgxData: IPgxReportData[] = [];

    sample: ISample;

    public isLoadingSubject: BehaviorSubject<boolean>
    public isLoading$: Observable<boolean>

    constructor(
        private reportService: ReportService,
        private cd: ChangeDetectorRef
    ) { 
        this.isLoadingSubject = new BehaviorSubject(false);
        this.isLoading$ = this.isLoadingSubject.asObservable();
    }

    ngOnInit(): void {
        this.loadReportData();
    }



    loadReportData(): void {
        const sb = this.reportService.getReportData(this.analysisId)
            .subscribe((data: IReportData) => {

                this.pgxData = data.pgxData
                this.categories = data.categories
                this.sample = data.sample

                this.cd.detectChanges()
            })

        this.subscriptions.push(sb);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }
}
