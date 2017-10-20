import { NavigationEnd, Router, RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRouteGuard } from './shared/common/auth/auth-route-guard';
import { FeedbackComponent } from './feedback/feedback.component';
import { NgModule } from '@angular/core';
import { SupportedBrowsersComponent } from 'app/shared/layout/supported-browsers/supported-browsers.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AppComponent,
                data: { breadcrumb: 'Home' },
                children: [
                    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
                    {
                        path: 'feedback',
                        loadChildren: 'app/feedback/feedback.module#FeedbackModule', // Lazy load main module
                        data: { preload: true }
                    },
                    {
                        path: 'settings',
                        loadChildren: 'app/account-settings/account-settings.module#AccountSecurityModule', // Lazy load main module
                        data: { preload: true }
                    },
                    {
                        path: 'notifications',
                        loadChildren: 'app/notifications/notifications.module#NotificationsModule', // Lazy load main module
                        data: { preload: true }
                    },
                    {
                        path: 'dashboard',
                        loadChildren: 'app/dashboard/dashboard.module#DashboardModule', // Lazy load main module
                        data: { preload: true }
                    },
                    {
                        path: 'booking',
                        loadChildren: 'app/booking-manage/booking/booking.module#BookingModule', // Lazy load booking module
                        data: { preload: true }
                    },
                    {
                        path: 'bookingorder',
                        loadChildren: 'app/booking-manage/booking-order/booking-order.module#BookingOrderModule', // Lazy load booking order module
                        data: { preload: true }
                    },
                    {
                        path: 'organization',
                        loadChildren: 'app/organization-manage/org-info/organization.modules#OrganizationModule', // Lazy load admin module
                        data: { preload: true }
                    },
                    {
                        path: 'outlet',
                        loadChildren: 'app/organization-manage/outlet/outlet.modules#OutletModule', // Lazy load admin module
                        data: { preload: true }
                    }
                ]
            },
            {
                path: 'supported-browsers',
                component: SupportedBrowsersComponent
            }
        ])
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
    constructor(private router: Router) {
        router.events.subscribe((event: NavigationEnd) => {
            if (!(event instanceof NavigationEnd)) { return; }
            setTimeout(() => {
                this.resetYAxial();
            }, 0);
        });
    }

    resetYAxial(): void {
        $('html,body').animate({ 'scrollTop': 0 });
    }
}