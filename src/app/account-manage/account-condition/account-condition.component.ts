import { Component, OnInit, Injector, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { BaseGridDataInputDto } from 'shared/grid-data-results/base-grid-data-Input.dto';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { AppComponentBase } from 'shared/common/app-component-base';
import { accountModuleAnimation } from 'shared/animations/routerTransition';
import { PaymentServiceProxy, SubscriptionPaymentListDto, EditionSubscriptionServiceProxy, EditionsViewOutput, FlatFeatureSelectDto, EditionWithFeaturesDto } from 'shared/service-proxies/service-proxies';
import { AppGridData } from 'shared/grid-data-results/grid-data-results';
import { PageChangeEvent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { AccountInfo } from 'app/shared/utils/account-info';
import { Moment } from 'moment';
import { PaysType } from 'shared/AppEnums';
import { GetCurrentFeatures } from 'shared/AppConsts';

@Component({
    selector: 'xiaoyuyue-account-condition',
    templateUrl: './account-condition.component.html',
    styleUrls: ['./account-condition.component.scss'],
    animations: [accountModuleAnimation()],
    encapsulation: ViewEncapsulation.None
})
export class AccountConditionComponent extends AppComponentBase implements OnInit, AfterViewInit {
    isHighestEdition: boolean;
    currentEditions: EditionWithFeaturesDto;
    allFeatures: FlatFeatureSelectDto[];
    accountInfo: AccountInfo = new AccountInfo();
    isShowPaymentHistory = false;
    mobilePaymentHistoryData: SubscriptionPaymentListDto[];
    showConditionContent = false;
    gridParam: BaseGridDataInputDto
    paymentHistoryData = new AppGridData();
    constructor(
        private injector: Injector,
        private _sessionService: AppSessionService,
        private _paymentService: PaymentServiceProxy,
        private _editionSubscriptionService: EditionSubscriptionServiceProxy
    ) {
        super(injector);
        this.gridParam = new BaseGridDataInputDto(this._sessionService);
    }

    ngOnInit() {
        this.isHighestEdition = this._sessionService.tenant.edition.isHighestEdition;
        this.getAccountInfo();
        this.getCurrentEditions();
    }

    ngAfterViewInit() {
        this.isMobile($('.mobile-account-condition')) ? this.mobileLoadPaymentHistoryData() : this.loadPaymentHistoryData();
    }

    // 获取历史账单
    loadPaymentHistoryData(): void {
        const loadData = () => {
            return this._paymentService
                .getPaymentHistory(
                this.gridParam.GetSortingString(),
                this.gridParam.MaxResultCount,
                this.gridParam.SkipCount);
        };

        this.paymentHistoryData.query(loadData, false, () => {
        });
    }

    // 获取当前版本信息
    getCurrentEditions(): void {
        this._editionSubscriptionService
            .getCurrentEdition()
            .subscribe(result => {
                this.allFeatures = result.allFeatures;
                this.currentEditions = result.editionWithFeatures;
            })
    }

    // 获取指定版本的显示名称
    getEditionDisplayName(name: string): string {
        let displayName = '';
        this.allFeatures.forEach((element: FlatFeatureSelectDto) => {
            if (name === 'App.MaxBookingCount') {
                displayName = element.displayName + GetCurrentFeatures.AllFeatures['App.MaxBookingCount'].value + '个';
                return;
            }
            if (name === 'App.MaxOutletCount') {
                displayName = element.displayName + GetCurrentFeatures.AllFeatures['App.MaxOutletCount'].value + '个';
                return;
            }
            if (element.name === name) {
                displayName = element.displayName;
                return;
            }
        });
        return displayName;
    }

    // 获取账户信息
    getAccountInfo(): void {
        this.accountInfo.tenantName = this._sessionService.tenant.tenancyName;
        this.accountInfo.editionId = this._sessionService.tenant.edition.id;
        this.accountInfo.editionDisplayName = this._sessionService.tenant.edition.displayName;
        this.accountInfo.editionTimeLimit = this.editionTimeLimitIsValid(this._sessionService.tenant.subscriptionEndDateUtc)
        this.accountInfo.subCreatedBookingCount = this._sessionService.tenant.bookingNum;
        this.accountInfo.subCreatedOutletCount = this._sessionService.tenant.outletNum;
        this.accountInfo.maxBookingCount = GetCurrentFeatures.AllFeatures['App.MaxBookingCount'].value;
        this.accountInfo.maxOutletCount = GetCurrentFeatures.AllFeatures['App.MaxOutletCount'].value;
        console.log(this.accountInfo);
    }

    /*
        判断版本到期时间是否有效
        @return string
        有效返回时间字符串，否则返回免费版的"永久有效"
     */
    private editionTimeLimitIsValid(editionTimeLimit: Moment): string {
        let timeLimitName: string;
        if (editionTimeLimit) {
            timeLimitName = this.t(editionTimeLimit);
            this.accountInfo.paysTypeDisplayName = '续费会员';
            this.accountInfo.paysType = PaysType.RenewalsMembership;
        } else {
            timeLimitName = '永久有效';
            this.accountInfo.paysTypeDisplayName = '开通会员';
            this.accountInfo.paysType = PaysType.JoinMembership;
        }
        return timeLimitName;
    }

    // 切换页码
    public pageChange(event: PageChangeEvent): void {
        this.gridParam.CurrentPage = (this.gridParam.SkipCount + this.gridParam.MaxResultCount) / this.gridParam.MaxResultCount;
        this.gridParam.SkipCount = this.gridParam.MaxResultCount * (this.gridParam.CurrentPage - 1);
    }

    public dataStateChange({ skip, take, sort }: DataStateChangeEvent): void {
        this.gridParam.SkipCount = skip;
        this.gridParam.MaxResultCount = take;
        this.gridParam.Sorting = sort;
        this.loadPaymentHistoryData();
    }

    /* 移动端代码 */
    mobileLoadPaymentHistoryData(): void {
        this._paymentService
            .getPaymentHistory(
            this.gridParam.GetSortingString(),
            this.gridParam.MaxResultCount,
            this.gridParam.SkipCount)
            .subscribe(result => {
                this.mobilePaymentHistoryData = result.items;
            })
    }

    isShowConditionContent(): void {
        this.showConditionContent = !this.showConditionContent;
    }

    // 由于tabset导致初始化better-scroll失效，尝试把历史账单DOM结构移除tabset，点击后显示DOM
    selectPaymentHistory(toggle: boolean): void {
        this.isShowPaymentHistory = toggle;
    }
}
