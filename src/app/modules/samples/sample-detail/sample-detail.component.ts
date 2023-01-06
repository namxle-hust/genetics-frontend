import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-sample-detail',
    templateUrl: './sample-detail.component.html',
    styleUrls: ['./sample-detail.component.scss']
})
export class SampleDetailComponent implements OnInit {
    sampleId: number

    public currentTabIndex: number = 0

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
        private route: ActivatedRoute
    ) {

    }

    ngOnInit(): void {
        this.sampleId = this.route.snapshot.params["id"]

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
