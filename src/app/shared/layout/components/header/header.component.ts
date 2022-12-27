import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../core/layout.service';
import { MenuComponent } from '../../../kt/components';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
    headerContainerCssClasses: string = '';
    @ViewChild('ktPageTitle', { static: true }) ktPageTitle: ElementRef;

    headerMenuCSSClasses: string;

    private unsubscribe: Subscription[] = [];

    constructor(private layout: LayoutService, private router: Router) {
        this.routingChanges();
    }

    ngOnInit(): void {
        this.headerContainerCssClasses =
            this.layout.getStringCSSClasses('headerContainer');
        this.headerMenuCSSClasses = this.layout.getStringCSSClasses('header_menu');
    }

    routingChanges() {
        const routerSubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
                MenuComponent.reinitialization();
            }
        });
        this.unsubscribe.push(routerSubscription);
    }

    ngOnDestroy() { }
}
