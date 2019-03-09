// 全局设置，请求url统一前缀和显示名称
window.config = {
    api: 'http://118.112.189.117/api',
    token: 'ACCESS-TOKEN',
    appName: 'SB Admin <sup>2</sup>'
}

// ajax全局设置，统一添加ACCESS-TOKEN，统一拦截错误信息
$($.ajaxSetup({
    contentType: 'application/json; charset=utf-8',
    beforeSend: function (xhr) {
        if (localStorage.getItem(window.config.token)) {
            xhr.setRequestHeader(window.config.token, localStorage.getItem(window.config.token));
        }
    },
    dataType: "json",
    complete: function (xhr) {
        // console.log("ajax complete");
        if (xhr.status == 200) {
            if (xhr.responseJSON) {
                if (xhr.responseJSON.errorCode != 200) {
                    if (xhr.responseJSON.errorCode == 401) {
                        // console.log("未登录");
                        toastr.warning(xhr.responseJSON.message);
                        setTimeout(function () {
                            window.location = "./login.html";
                        }, 1000);
                    } else {
                        toastr.warning(xhr.responseJSON.message);
                    }
                }
            }
        }
    }
}))

// 消息提示全局设置
toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-center",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "3000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}
