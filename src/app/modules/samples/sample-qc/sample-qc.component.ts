import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
    selector: 'app-sample-qc',
    templateUrl: './sample-qc.component.html',
    styleUrls: ['./sample-qc.component.scss']
})
export class SampleQcComponent implements OnInit {

    url: string = 'http://vg-dev-v2.btgenomics.com/?species=Human&build=GRCh37&vcf=http%3A%2F%2Fs3.amazonaws.com%2Fvcf.files%2FExAC.r0.2.sites.vep.vcf.gz&tbi='

    isLoadingSubject: BehaviorSubject<boolean>
    isLoading$: Observable<boolean>;

    loadedTimes: number;

    constructor() {
        this.isLoadingSubject = new BehaviorSubject<boolean>(true);
        this.isLoading$ = this.isLoadingSubject.asObservable();
        this.loadedTimes = 0;
    }

    ngOnInit(): void {

    }

    iframeLoaded(): void {
        // This iframe needs load 2 times before showing the charts
        if (this.loadedTimes == 0) {
            this.loadedTimes ++;
            return;
        }
        this.isLoadingSubject.next(false);
    }

}
