import '@node_modules/qiniu-js/dist/qiniu.min';

import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { AppComponentBase } from 'shared/common/app-component-base';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { ModalDirective } from 'ngx-bootstrap';
import { PictureServiceProxy } from 'shared/service-proxies/service-proxies';
import { UploadPictureDto } from 'app/shared/utils/upload-picture.dto';

@Component({
    selector: 'xiaoyuyue-upload-picture-none-gallery',
    templateUrl: './upload-picture-none-gallery.component.html',
    styleUrls: ['./upload-picture-none-gallery.component.scss']
})


export class UploadPictureNoneGalleryComponent extends AppComponentBase implements OnInit {
    imageMogr2Link: string;
    loading = false;
    private _$profilePicture: JQuery;

    public uploadPictureInfo: UploadPictureDto = new UploadPictureDto();

    @Output() picUploadInfoHandler: EventEmitter<UploadPictureDto> = new EventEmitter();
    @Input() uploadUid: number;
    @Input() groupId: number = 0;
    @Input() cropScaleX: number = 1;
    @Input() cropScaleY: number = 1;
    @ViewChild('uploadPictureNoneGalleryModel') modal: ModalDirective;

    constructor(
        injector: Injector,
        private _pictureServiceProxy: PictureServiceProxy,
        private _appSessionService: AppSessionService,
        private _sanitizer: DomSanitizer
    ) {
        super(
            injector
        );
    }

    ngOnInit() {
    }

    show(): void {
        this.modal.show();
        this.initFileUploader();
    }
    close(): void {
        this.modal.hide();
        this.picturyDestroy();
    }

    picturyDestroy(): void {
        this.uploadPictureInfo = new UploadPictureDto();
        this._$profilePicture.css({
            'background-image': 'url("")'
        })
    }

    initFileUploader(): void {
        const self = this;
        this._$profilePicture = $('#profilePicture' + this.uploadUid);

        let token = '';
        this._pictureServiceProxy
            .getPictureUploadToken()
            .subscribe(result => {
                token = result.token;
                self._$profilePicture = $('#profilePicture' + self.uploadUid);

                // 引入Plupload 、qiniu.js后
                var Q1 = new QiniuJsSDK();
                const uploader = Q1.uploader({
                    runtimes: 'html5,flash,html4',    // 上传模式,依次退化
                    browse_button: 'uploadArea' + self.uploadUid,       // 上传选择的点选按钮，**必需**
                    // uptoken_url: '/token',            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
                    uptoken: token, // 若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
                    // unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
                    // save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
                    domain: 'http://image.xiaoyuyue.com/',   // bucket 域名，下载资源时用到，**必需**
                    get_new_uptoken: false,  // 设置上传文件的时候是否每次都重新获取新的token
                    // container: 'uploadAreaWrap'+self.uploadUid,           //上传区域DOM ID，默认是browser_button的父元素，
                    max_file_size: '4mb',           // 最大文件体积限制
                    // flash_swf_url: 'js/plupload/Moxie.swf',  //引入flash,相对路径
                    max_retries: 0,                   // 上传失败最大重试次数
                    dragdrop: false,                   // 开启可拖曳上传
                    // drop_element: 'dropArea'+self.uploadUid,        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                    chunk_size: '4mb',                // 分块上传时，每片的体积
                    resize: {
                        crop: false,
                        quality: 60,
                        preserve_headers: false
                    },
                    auto_start: false,                 // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
                    x_vars: {
                        groupid: function (up, file) {
                            return self.groupId;
                        },
                        imageMogr2: function() {
                            return self.imageMogr2Link;
                        }
                    },
                    /*x_vals: {
                      'groupid': 1
                    },*/
                    init: {
                        'FilesAdded': function (up, files) {
                            plupload.each(files, function (file) {
                                // 文件添加进队列后,处理相关的事情
                                // 上传之前本地预览
                                for (let i = 0; i < files.length; i++) {
                                    const fileItem = files[i].getNative(),
                                        url = window.URL;
                                    const src = url.createObjectURL(fileItem);
                                    self._$profilePicture.attr('src', src);
                                    self._$profilePicture.cropper({
                                        dragMode: 'move',
                                        viewMode: 1,
                                        aspectRatio: self.cropScaleX / self.cropScaleY,
                                        crop: function (e) {
                                            let cropValue = `!${e.width}x${e.height}a${e.x}a${e.y}`;
                                            self.imageMogr2Link = Q1.imageMogr2({
                                                'auto-orient': true,  // 布尔值，是否根据原图EXIF信息自动旋正，便于后续处理，建议放在首位。
                                                strip: false,   // 布尔值，是否去除图片中的元信息
                                                // thumbnail: '1000x1000',   // 缩放操作参数
                                                crop: cropValue,  // 裁剪操作参数
                                                gravity: 'NorthWest',    // 裁剪锚点参数
                                                quality: 65,  // 图片质量，取值范围1-100
                                                // rotate: 20,   // 旋转角度，取值范围1-360，缺省为不旋转。
                                                // format: 'jpg',// 新图的输出格式，取值范围：jpg，gif，png，webp等
                                                // blur: '3x5'    // 高斯模糊参数
                                            });
                                        }
                                    });
                                }
                            });
                        },
                        'BeforeUpload': function (up, file) {
                            // 每个文件上传前,处理相关的事情
                            self.loading = true;
                        },
                        'UploadProgress': function (up, file) {
                            // 每个文件上传时,处理相关的事情
                        },
                        'FileUploaded': function (up, file, info) {
                            // 每个文件上传成功后,处理相关的事情
                            // 其中 info 是文件上传成功后，服务端返回的json，形式如
                            // {
                            //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                            //    "key": "gogopher.jpg"
                            //  }
                            // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

                            const res = JSON.parse(info).result;
                            const currentPicUrl = res.originalUrl;
                            const currentPicId = res.pictureId;
                            self.uploadPictureInfo.pictureUrl = self._sanitizer.bypassSecurityTrustResourceUrl(currentPicUrl);
                            self.uploadPictureInfo.pictureId = currentPicId;
                            self.picUploadInfoHandler.emit(self.uploadPictureInfo);
                            self.loading = false;
                            self.close();
                        },
                        'Error': function (up, err, errTip) {
                            // 上传出错时,处理相关的事情
                            self.loading = false;
                            self.notify.error('上传失败，请重新上传');
                        },
                        'UploadComplete': function () {
                            uploader.destroy();
                            self.picturyDestroy();
                            // 队列文件处理完毕后,处理相关的事情
                        },
                        'Key': (up, file) => {
                            // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                            // 该配置必须要在 unique_names: false , save_key: false 时才生效
                            const id = this._appSessionService.tenantId;
                            const groupId = this.groupId;
                            const date = new Date();
                            const timeStamp = date.getTime().valueOf();
                            const key = `${id}/${groupId}/${timeStamp}`;
                            // do something with key here
                            return key
                        }
                    }
                });
                $('#confirmUpload' + self.uploadUid).on('click', function () {
                    uploader.start();
                });

                $('#cancelUpload' + self.uploadUid).on('click', () => {
                    uploader.destroy();
                    this.picturyDestroy();
                });
            });
    }

}
