import * as _ from 'lodash';

import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, Injector, OnInit, transition } from '@angular/core';
import { ExternalLoginProvider, LoginService } from 'shared/services/login.service';
import { ExternalLoginProviderInfoModel, ShortAuthTokenModel, TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';

import { AppComponentBase } from 'shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { CookiesService } from 'shared/services/cookies.service';
import { UrlHelper } from '@shared/helpers/UrlHelper';

@Component({
    selector: 'xiaoyuyue-loading',
    templateUrl: './external-auth.component.html',
    styleUrls: ['./external-auth.component.scss']
})
export class ExternalAuthComponent extends AppComponentBase implements OnInit, AfterViewInit {
    isAuthBind = false;
    constructor(
        injector: Injector,
        private _router: Router,
        private _loginService: LoginService,
        private _activatedRoute: ActivatedRoute,
        private _tokenAuthService: TokenAuthServiceProxy,
        private _cookiesService: CookiesService
    ) {
        super(injector);
    }

    ngOnInit() {

    }

    ngAfterViewInit(): void {
        debugger;
        const params = this.getQueryParams();
        if (params['shortAuthToken'] !== undefined) {
            const input = new ShortAuthTokenModel();
            input.shortAuthToken = params['shortAuthToken']
            this._tokenAuthService.authenticateByShortAuth(input).subscribe((result) => {
                this._cookiesService.setToken(result.accessToken);
                this.externalLogin(params);
            });
        } else {
            this.externalLogin(params);
        }
    }

    externalLogin(params): void {
        if (params['redirectUrl'] !== undefined) {
            this._cookiesService.setCookieValue('UrlHelper.redirectUrl', params['redirectUrl'], null, '/');
        }

        if (params['isAuthBind'] !== undefined) {
            this.isAuthBind = (params['isAuthBind'] === 'true');
        }

        if (params['providerName'] !== undefined) {
            if (this.isAuthBind) {
                this._loginService.externalBindingCallback(params);
            } else {
                this._loginService.externalLoginCallback(params);
            }
        }
    }

    private getQueryParams() {
        const avaliableQuery = location.href.substring(location.href.indexOf('?') + 1).replace('#access_token', '&access_token');
        const param = UrlHelper.getQueryParametersUsingParameters(avaliableQuery);

        if (param['state']) {
            debugger;
            const stateParam = UrlHelper.getQueryParametersUsingParameters(avaliableQuery.replace('state=', '').replace(param['state'], '') + '&' + decodeURIComponent(param['state']));
            return stateParam;
        } else {
            return param;
        }
    }
}
