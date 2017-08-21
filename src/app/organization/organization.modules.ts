import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule, SharedModule } from '@progress/kendo-angular-grid';
import { ModalModule, PopoverModule, TabsModule, TooltipModule } from 'ngx-bootstrap';

import { AppCommonModule } from 'app/shared/common/app-common.module';
import { BaseInfoComponent } from 'app/booking/create-or-edit/base-info/base-info.component';
import { BookingCustomModelComponent } from 'app/booking/list/booking-custom-model/booking-custom-model.component';
import { BookingListComponent } from 'app/booking/list/booking-list.component';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { CommonModule } from '@angular/common';
import { ConfirmOrderModelComponent } from 'app/booking/list/confirm-order-model/confirm-order-model.component';
import { ContactInfoComponent } from 'app/organization/outlet/create-or-edit-outlet/contact-info/contact-info.component';
import { CreateOrEditOutletComponent } from 'app/organization/outlet/create-or-edit-outlet/create-or-edit-outlet.component';
import { DateInputModule } from '@progress/kendo-angular-dateinputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { OrgInfoComponent } from 'app/organization/info/org-info.component';
import { OrganizationRoutingModule } from "app/organization/organization-routing.module";
import { OutletImageComponent } from 'app/organization/outlet/create-or-edit-outlet/outlet-image/outlet-image.component';
import { OutletListComponent } from 'app/organization/outlet/outlet-list.component';
import { PaginationComponent } from 'app/shared/pagination/pagination.component';
import { PictureManageComponent } from 'app/booking/create-or-edit/picture-manage/picture-manage.component';
import { QRCodeModule } from 'angular2-qrcode';
import { ShareBookingModelComponent } from 'app/booking/create-or-edit/share-booking-model/share-booking-model.component';
import { TimeInfoComponent } from 'app/booking/create-or-edit/time-info/time-info.component';
import { UploadOrgBgComponent } from 'app/organization/info/upload-bg/upload-bg.component';
import { UploadOrgLogoComponent } from 'app/organization/info/upload-logo/upload-logo.component';
import { UtilsModule } from '@shared/utils/utils.module';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,

        ModalModule.forRoot(),
        TabsModule.forRoot(),
        TooltipModule.forRoot(),
        PopoverModule.forRoot(),

        OrganizationRoutingModule,
        UtilsModule,
        AppCommonModule,
        GridModule,
        DropDownsModule,
        ButtonsModule,
        SharedModule,
        DialogModule,
        DateInputModule,
        QRCodeModule,
        NgxPaginationModule
    ],
    declarations: [
        CreateOrEditOutletComponent,
        OutletListComponent,
        OrgInfoComponent,
        OutletImageComponent,
        ContactInfoComponent,
        UploadOrgLogoComponent,
        UploadOrgBgComponent,
    ],
    providers: [

    ]
})
export class OrganizationModule { }