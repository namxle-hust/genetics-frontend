import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { IAnalysisQCUrl } from 'src/app/core/models';
import { AnalysisService } from 'src/app/core/services';

@Component({
    selector: 'app-analysis-qc',
    templateUrl: './analysis-qc.component.html',
    styleUrls: ['./analysis-qc.component.scss']
})
export class AnalysisQcComponent implements OnInit, OnDestroy {
    @Input() analysisId: number;

    private subscriptions: Subscription[] = []

    url: string;

    //= 'http://vg-dev-v2.btgenomics.com/?species=Human&build=GRCh37&vcf=http%3A%2F%2Fs3.amazonaws.com%2Fvcf.files%2FExAC.r0.2.sites.vep.vcf.gz&tbi='

    isLoadingSubject: BehaviorSubject<boolean>
    isLoading$: Observable<boolean>;

    isUrlLoadingSubject: BehaviorSubject<boolean>
    isUrlLoading$: Observable<boolean>;


    loadedTimes: number = 0;

    constructor(private analysisService: AnalysisService) {
        this.isLoadingSubject = new BehaviorSubject<boolean>(true);
        this.isLoading$ = this.isLoadingSubject.asObservable();

        this.isUrlLoadingSubject = new BehaviorSubject<boolean>(true);
        this.isUrlLoading$ = this.isUrlLoadingSubject.asObservable();
    }

    ngOnInit(): void {
        const sb = this.analysisService.getQCUrl(this.analysisId).subscribe((data: IAnalysisQCUrl) => {
            if (data) {
                this.url = data.url
                this.isUrlLoadingSubject.next(false)
                console.log(data);
            } else {
                this.isLoadingSubject.next(false);
            }
        })
        this.subscriptions.push(sb);
    }

    iframeLoaded(): void {
        // This iframe needs load 2 times before showing the charts
        if (this.loadedTimes == 0) {
            this.loadedTimes ++;
            return;
        }
        this.isLoadingSubject.next(false);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sb => sb.unsubscribe)
    }

}
