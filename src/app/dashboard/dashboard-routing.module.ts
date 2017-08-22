import { AdminPermissions } from '@shared/AdminPermissions';
import { AppRouteGuard } from 'app/shared/common/auth/auth-route-guard';
import { DashboardComponent } from './dashboard.component';
import { NgModule } from '@angular/core';
import { Route } from '@angular/router';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                canActivate: [AppRouteGuard],
                canActivateChild: [AppRouteGuard],
                component: DashboardComponent, data: { permission: AdminPermissions.tenantDashboard },
                children: [
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class DashboardRoutingModule { }