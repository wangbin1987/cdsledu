// 全局设置，请求url统一前缀和显示名称
window.config = {
    api: 'http://118.112.189.117/api',
    token: 'ACCESS-TOKEN',
    appName: 'SB Admin <sup>2</sup>'
}

// 获取地址栏的参数
function getUrlParam(name) {
    // 未传参，返回空
    if (!name) return null;
    // 查询参数：先通过search取值，如果取不到就通过hash来取
    let after = window.location.search;
    after = after.substr(1) || window.location.hash.split('?')[1];
    // 地址栏URL没有查询参数，返回空
    if (!after) return null;
    // 如果查询参数中没有"name"，返回空
    if (after.indexOf(name) === -1) return null;

    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    // 当地址栏参数存在中文时，需要解码，不然会乱码
    let r = decodeURI(after).match(reg);
    // 如果url中"name"没有值，返回空
    if (!r) return null;
    return r[2];
}

// datatable 添加中文排序
function addChieseAsc() {
    jQuery.fn.dataTableExt.oSort['chinese-asc'] = function (x, y) {
        x = (x instanceof Array) ? x[0] : x == '-' ? 'z' : x; //z的ASCII码值最大
        y = (y instanceof Array) ? y[0] : y == '-' ? 'z' : y;
        //javascript自带的中文比较函数，具体用法可自行查阅了解
        return x.localeCompare(y);
    };

    jQuery.fn.dataTableExt.oSort['chinese-desc'] = function (x, y) {
        x = (x instanceof Array) ? x[0] : x == '-' ? 'z' : x;
        y = (y instanceof Array) ? y[0] : y == '-' ? 'z' : y;
        return y.localeCompare(x);
    };

    // aTypes是插件存放表格内容类型的数组
    // reg赋值的正则表达式，用来判断是否是中文字符
    // 返回值push到aTypes数组，排序时扫描该数组，'chinese'则调用上面两个方法。返回null默认是'string'
    jQuery.fn.dataTableExt.aTypes.push(function (sData) {
        let reg = /^[\u4e00-\u9fa5]*$/;
        if (reg.test(sData)) {
            return 'chinese';
        }
        return null;
    });
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
