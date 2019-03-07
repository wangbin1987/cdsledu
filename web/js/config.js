window.config = {
    api: 'http://127.0.0.1:8080',
    token: 'ACCESS-TOKEN',
    appName: 'SB Admin <sup>2</sup>'
}
toastr.options = {
    "closeButton": false,//显示关闭按钮
    "debug": false,//启用debug
    "positionClass": "toast-top-center",//弹出的位置
    "showDuration": "300",//显示的时间
    "hideDuration": "1000",//消失的时间
    "timeOut": "5000",//停留的时间
    "extendedTimeOut": "1000",//控制时间
    "showEasing": "swing",//显示时的动画缓冲方式
    "hideEasing": "linear",//消失时的动画缓冲方式
    "showMethod": "fadeIn",//显示时的动画方式
    "hideMethod": "fadeOut"//消失时的动画方式
}
$($.ajaxSetup({
    contentType: 'application/json; charset=utf-8',
    beforeSend: function (xhr) {
        if (localStorage.getItem(window.config.token)) {
            xhr.setRequestHeader(window.config.token, localStorage.getItem(window.config.token));
        }
    },
    dataType: "json",
    complete: function (xhr, ts) {
        // console.log("ajax complete");
        if (xhr.status == 200) {
            if (xhr.responseJSON) {
                if (xhr.responseJSON.errorCode != 200) {
                    if (xhr.responseJSON.errorCode == 401) {
                        // console.log("未登录");
                        toastr.warn(xhr.responseJSON.message);
                        setTimeout(function () {
                            window.location = "./login.html";
                        }, 1000);
                    } else {
                        toastr.error(xhr.responseJSON.message);
                    }
                }
            }
        }
    }
}))