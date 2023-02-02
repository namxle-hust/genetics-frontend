import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AnalysisModel } from 'src/app/core/models';
import { AnalysisService } from 'src/app/core/services';

enum TABS {
    QC = 'quality-control',
    VARIANTS = 'variants',
    REPORT = 'report'
}
@Component({
    selector: 'app-analysis-detail',
    templateUrl: './analysis-detail.component.html',
    styleUrls: ['./analysis-detail.component.scss']
})
export class AnalysisDetailComponent implements OnInit, OnDestroy {
    analysisId: number

    analysis: AnalysisModel;

    public tab: string | null;

    public currentTabIndex: number = 0

    private subscription: Subscription [] = []

    public tabs = [
        {
            name: 'Quality Control',
            id: TABS.QC,
            isSelected: true,
        },
        {
            name: 'Variants',
            id: TABS.VARIANTS,
            isSelected: false
        },
        {
            name: 'Report',
            id: TABS.REPORT,
            isSelected: false
        }
    ]

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private analysisService: AnalysisService
    ) {
        this.route.fragment.subscribe(tab => {
            if (!tab) {
                this.tab = TABS.QC
            } else {
                this.tab = tab
            }
            console.log('Change')
            this.updateTab()
        })
    }

    ngOnInit(): void {
        this.analysisId = this.route.snapshot.params["id"]

        const sb = this.analysisService.getItemById(this.analysisId).subscribe((data: AnalysisModel) => {
            this.analysis = data;
        })

        this.subscription.push(sb)
    }

    ngOnDestroy(): void {
        this.subscription.forEach(sb => sb.unsubscribe())
    }

    back(): void {
        this.router.navigateByUrl('/analysis')
    }

    updateTab(): void {
        this.tabs.forEach((tab, index) => {
            if (tab.id == this.tab) {
                this.currentTabIndex = index;
                tab.isSelected = true
            } else {
                tab.isSelected = false
            }
        })
    }

    changeTab(id: TABS) {
        this.router.navigate(['.'], {fragment: id, relativeTo: this.route })
    }

}
