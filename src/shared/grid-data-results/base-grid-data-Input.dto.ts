import { SortDescriptor } from '@progress/kendo-data-query';
import { AppConsts } from '@shared/AppConsts';

export class BaseGridDataInputDto {
    ButtonCount = 5;
    Info = true;
    Type: 'numeric' | 'input' = 'numeric';
    PageSizes = true;
    PreviousNext = true;
    SkipCount = 0;
    MaxResultCount: number = AppConsts.grid.defaultPageSize;
    Sorting: Array<SortDescriptor> = [];

    constructor(buttonCount = 5, pageSizes = true, previousNext = true, info = true) {
        this.ButtonCount = buttonCount;
        this.PageSizes = pageSizes;
        this.PreviousNext = previousNext;
        this.Info = info;
    }

    GetSortingString(): string {
        if (this.Sorting.length > 0 && this.Sorting[0].dir) {
            return this.Sorting[0].field + ' ' + this.Sorting[0].dir;
        } else {
            return '';
        }
    }
}

export class UserGridDataInputDto extends BaseGridDataInputDto {
    Permission: string;
    RoleIds: number[];
    UserName: string;
    Surname: string;
    Email: string;
    IsEmailConfirmed: boolean;
    PhoneNumber: string;
    IsPhoneConfirmed: boolean;
    IsActive: boolean;
}

export class LanguageTextGridDataInputDto extends BaseGridDataInputDto {
    targetLanguageName: string;
    sourceName: string;
    baseLanguageName: string;
    targetValueFilter: string;
    filterText: string;
}

export class LogsGridDataInputDto extends BaseGridDataInputDto {
    startDate: any;
    endDate: any;
    userName: string;
    serviceName: string;
    methodName: string;
    browserInfo: string;
    hasException: boolean;
    minExecutionDuration: number;
    maxExecutionDuration: number;
}