﻿import { AppConsts } from '@shared/AppConsts';
import { CookiesService } from 'shared/services/cookies.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AppAuthService {

    constructor(
        private _cookiesService: CookiesService,
    ) { }

    logout(reload?: boolean, returnUrl?: string): void {
        this._cookiesService.clearToken();
        if (reload !== false) {
            if (returnUrl) {
                location.href = returnUrl;
            } else {
                location.href = AppConsts.appBaseUrl;
            }
        }
    }

    isLogin(): boolean {
        if (abp.auth.getToken()) {
            return true;
        }
        return false;
    }

    recordRedirectUrl(): void {
        const exdate = new Date();
        exdate.setDate(exdate.getDate() + 1);
        this._cookiesService.deleteCookie('UrlHelper.redirectUrl', '/');
        // 测试域名
        const domainArr = ['http://business.xiaoyuyue.com/', 'http://localhost:5202/'];
        if (domainArr.indexOf(location.href) < 0) {
            this._cookiesService.setCookieValue('UrlHelper.redirectUrl', location.href, exdate, '/');
        }
    }
}