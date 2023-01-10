import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AnalysisModel } from 'src/app/core/models';
import { AnalysisService } from 'src/app/core/services';

@Component({
    selector: 'app-analysis-detail',
    templateUrl: './analysis-detail.component.html',
    styleUrls: ['./analysis-detail.component.scss']
})
export class AnalysisDetailComponent implements OnInit, OnDestroy {
    analysisId: number

    analysis: AnalysisModel;

    public currentTabIndex: number = 0

    private subscription: Subscription [] = []

    public tabs = [
        {
            name: 'Quality Control',
            isSelected: true,
        },
        {
            name: 'Variants',
            isSelected: false
        }
    ]

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private analysisService: AnalysisService
    ) {

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

    changeTab(name: string): void {
        this.tabs.forEach((tab, index) => {
            if (tab.name == name) {
                this.currentTabIndex = index;
                tab.isSelected = true
            } else {
                tab.isSelected = false
            }
        })
    }

}
