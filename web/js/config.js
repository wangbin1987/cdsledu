// 全局设置，请求url统一前缀和显示名称
window.config = {
    api: 'http://171.217.95.196',
    token: 'ACCESS-TOKEN',
    openid: 'OPENID',
    wechatInfo: 'wechat-info',
    userInfo: 'user-info',
    compulsorySearch: 'compulsorySearch',
    timeout: 1500,
    appName: '<div class="sidebar-brand-icon">' +
        '<i class="fas fa-graduation-cap"></i>' +
        '</div>' +
        '<div class="sidebar-brand-text mx-3" id="productName">双流教育</div>'
}

// 这个是自己内部使用
let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
let mobile = flag ? 1 : 0;

// ajax全局设置，统一添加ACCESS-TOKEN，统一拦截错误信息
$($.ajaxSetup({
    contentType: 'application/json; charset=utf-8',
    dataType: "json",
    timeout: 30000,
    beforeSend: function (xhr, settings) {
        if (localStorage.getItem(window.config.token)) {
            xhr.setRequestHeader(window.config.token, localStorage.getItem(window.config.token));
        }
        if (localStorage.getItem(window.config.openid)) {
            xhr.setRequestHeader(window.config.openid, localStorage.getItem(window.config.openid));
        }
        // 在请求前给修改 url（增加一个时间戳参数）
        settings.url += settings.url.match(/\?/) ? "&" : "?";
        settings.url += "time=" + new Date().getTime();
    },
    complete: function (xhr) {
        // console.info("请求地址：" + this.url);
        // if (xhr.responseJSON) {
        //     console.info(xhr.responseJSON);
        // }
        if (xhr.statusText == 'timeout') {
            if (mobile == 1) {
                $.toast("请求超时", "text");
            } else {
                toastr.warning("请求超时");
                try {
                    removeLoading();
                } catch (e) {

                }
            }
            return;
        }
        if (xhr.readyState == 4 && xhr.status == 200) {
            if (xhr.responseJSON) {
                if (xhr.responseJSON.errorCode != 200) {
                    if (xhr.responseJSON.errorCode) {
                        if (xhr.responseJSON.errorCode == 401) {
                            // console.log("未登录");
                            localStorage.clear();
                            toastr.warning(xhr.responseJSON.message);
                            setTimeout(function () {
                                window.location = "./login.html";
                            }, window.config.timeout);
                        } else {
                            if (mobile == 1) {
                                $.toast(xhr.responseJSON.message, "text");
                            } else {
                                toastr.warning(xhr.responseJSON.message);
                                try {
                                    removeLoading();
                                } catch (e) {

                                }
                            }
                        }
                    }
                }
            }
        }
    },
    error: function (xhr, textStatus, errorThrown) {
        // console.info("error", xhr);
        // 未授权无法访问会返回在这里
        if (xhr.responseJSON) {
            // springboot 对404的返回 {"timestamp":"","status":404,"error":"Not Found","message":"Not Found","path":"/system/updateKindergartenSignTime"}
            if (xhr.responseJSON.status && xhr.responseJSON.status == 404) {
                if (mobile == 1) {
                    $.toast("404找不到请求地址", "text");
                } else {
                    toastr.warning("404找不到请求地址");
                }
            } else {
                if (xhr.responseJSON.errorCode == 401) {
                    // console.log("未登录");
                    localStorage.clear();
                    toastr.warning(xhr.responseJSON.message);
                    setTimeout(function () {
                        window.location = "./login.html";
                    }, window.config.timeout);
                } else {
                    if (mobile == 1) {
                        $.toast(xhr.responseJSON.message, "text");
                    } else {
                        toastr.warning(xhr.responseJSON.message);
                    }
                }
            }
        } else {
            if (xhr.status == 404) {
                if (mobile == 1) {
                    $.toast("404找不到请求地址", "text");
                } else {
                    toastr.warning("404找不到请求地址");
                }
            } else {
                if (errorThrown.code == 19) {
                    if (mobile == 1) {
                        $.toast("请求超时", "text");
                    } else {
                        toastr.warning("请求超时");
                    }
                }
            }
        }
    }
}))

// 消息提示全局设置
toastr.options = {
    maxOpened: 1,
    autoDismiss: true,
    "closeButton": false,
    "debug": false,
    "newestOnTop": true,
    "progressBar": false,
    "positionClass": "toast-top-center",
    "preventDuplicates": true,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

// 浏览器兼容性问题
let agent = window.navigator.userAgent;
console.info(agent);
if (agent.indexOf('Trident') != -1) { // ie和360都有
    // if (agent.indexOf('InfoPath') != -1) { // 360兼容模式有个InfoPath
    toastr.warning('当前浏览器不支持，请使用谷歌浏览器或360浏览器极速模式打开');
    $("input").attr("disabled", "disabled");
    $("button").attr("disabled", "disabled");
    if (location.href.indexOf("login.html") == -1) {
        window.location = "./login.html";
    } else {
        alert('当前浏览器不支持，查看浏览器设置');
        window.location = "./help.html"
    }
    // }
}

/**
 * loading
 * @param title
 * @param des
 */
function loading(title, des) {
    $('body').loading({
        loadingWidth: 240,
        title: title,
        discription: des,
        name: 'loading',
        direction: 'column',
        type: 'origin',
        // originBg:'#71EA71',
        originDivWidth: 40,
        originDivHeight: 40,
        originWidth: 6,
        originHeight: 6,
        smallLoading: false,
        loadingMaskBg: 'rgba(0,0,0,0.2)'
    });
}