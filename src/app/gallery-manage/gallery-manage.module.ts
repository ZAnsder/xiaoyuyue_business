import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryManageComponent } from './gallery-manage.component';
import { PictureListComponent } from './picture-list/picture-list.component';
import { GalleryManageRoutes } from './gallery-manage.routing';
import { AppCommonModule } from 'app/shared/common/app-common.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        AppCommonModule,
        GalleryManageRoutes,
        NgxPaginationModule
    ],
    declarations: [
        GalleryManageComponent,
        PictureListComponent
    ]
})
export class GalleryManageModule { }