// 全局设置，请求url统一前缀和显示名称
window.config = {
    api: 'http://118.112.189.117/api',
    token: 'ACCESS-TOKEN',
    userInfo: 'user-info',
    compulsorySearch: 'compulsorySearch',
    timewait: 1500,
    appName: '<div class="sidebar-brand-icon">' +
        '<i class="fas fa-graduation-cap"></i>' +
        '</div>' +
        '<div class="sidebar-brand-text mx-3" id="productName">双流教育</div>'
}

// ajax全局设置，统一添加ACCESS-TOKEN，统一拦截错误信息
$($.ajaxSetup({
    contentType: 'application/json; charset=utf-8',
    dataType: "json",
    timeout: 30000,
    beforeSend: function (xhr, settings) {
        if (localStorage.getItem(window.config.token)) {
            xhr.setRequestHeader(window.config.token, localStorage.getItem(window.config.token));
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
            toastr.warning("请求超时");
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
                            }, window.config.timewait);
                        } else {
                            toastr.warning(xhr.responseJSON.message);
                        }
                    }
                }
            }
        }
    },
    error: function (xhr, textStatus, errorThrown) {
        console.info("error", xhr);
        // 未授权无法访问会返回在这里
        if (xhr.responseJSON) {
            // springboot 对404的返回 {"timestamp":"","status":404,"error":"Not Found","message":"Not Found","path":"/system/updateKindergartenSignTime"}
            if (xhr.responseJSON.status && xhr.responseJSON.status == 404) {
                toastr.warning("404找不到请求地址");
            } else {
                if (xhr.responseJSON.errorCode == 401) {
                    // console.log("未登录");
                    localStorage.clear();
                    toastr.warning(xhr.responseJSON.message);
                    setTimeout(function () {
                        window.location = "./login.html";
                    }, window.config.timewait);
                } else {
                    toastr.warning(xhr.responseJSON.message);
                }
            }
        } else {
            if (xhr.status == 404) {
                toastr.warning("404找不到请求地址");
            } else {
                if (errorThrown.code == 19) {
                    toastr.warning("请求超时");
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