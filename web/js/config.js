window.config = {
    api: 'http://127.0.0.1:8080',
    token: 'ACCESS-TOKEN',
    appName: 'SB Admin <sup>2</sup>'
}
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
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
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