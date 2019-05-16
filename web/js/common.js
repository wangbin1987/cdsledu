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

/**
 * 获取地址栏参数
 * @param key 参数名称
 * @returns {*}
 */
function getUrlParam(key) {
    // 未传参，返回空
    if (!key) return null;
    // 查询参数：先通过search取值，如果取不到就通过hash来取
    let after = window.location.search;
    after = after.substr(1) || window.location.hash.split('?')[1];
    // 地址栏URL没有查询参数，返回空
    if (!after) return null;
    // 如果查询参数中没有"name"，返回空
    if (after.indexOf(key) === -1) return null;

    let reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)');
    // 当地址栏参数存在中文时，需要解码，不然会乱码
    let r = decodeURI(after).match(reg);
    // 如果url中"name"没有值，返回空
    if (!r) return null;
    return r[2];
}

// 验证中文名称，包括藏族人名
function isChinaName(name) {
    let pattern = /^[\u4e00-\u9fa5]+·?[\u4e00-\u9fa5]+$/;
    return pattern.test(name);
}

// 验证手机号
function isTelephone(phone) {
    let pattern = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/;
    return pattern.test(phone);
}

// 是否是正整数
function isNumber(number) {
    let g = /^[1-9]*[1-9][0-9]*$/;
    return g.test(number);
}

// 验证身份证
function isCardNo(card) {
    let pattern = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([\d|x|X])$/;
    return pattern.test(card);
}

function isEmpty(str) {
    if (typeof str == "undefined" || str == null || str == "" || str == "null" || str.length == 0) {
        return true;
    } else {
        return false;
    }
}


// 产品名称
$("div#productName").parent().html(window.config.appName);
// $("div#productName").parent().attr("href", "javascript:void(0)");

// 退出登录
$(document).on("click", "button#logoutBtn", function () {
    logout();
})

function logout() {
    $.ajax({
        url: window.config.api + '/user/logout',
        method: "POST",
        success: function () {
            // console.log("未登录");
            localStorage.removeItem(window.config.token);
            localStorage.removeItem(window.config.userInfo);
            // 清空自己的请求参数
            localStorage.removeItem(window.config.compulsorySearch);
            localStorage.removeItem(window.config.dataTableCompulsory);
            window.location = "./login.html";
        }
    }).fail(function () {
        localStorage.removeItem(window.config.token);
        localStorage.removeItem(window.config.userInfo);
        window.location = "./login.html";
    });
}

/**
 * 获取用户信息
 */
function getUserInfo() {
    let userJsonStr = localStorage.getItem("user-info");
    if (isEmpty(userJsonStr)) {
        $.ajax({
            url: window.config.api + '/user/getUserInfo',
            method: "GET",
            async: false,
            success: function (response) {
                if (response.errorCode == 401) {
                    // console.log("未登录");
                    localStorage.removeItem(window.config.token);
                    localStorage.removeItem(window.config.userInfo);
                    // 清空自己的请求参数
                    localStorage.removeItem(window.config.compulsorySearch);
                    localStorage.removeItem(window.config.dataTableCompulsory);
                    toastr.warning(response.message);
                    setTimeout(function () {
                        window.location = "./login.html";
                    }, window.config.timeout);
                }
                localStorage.setItem(window.config.userInfo, JSON.stringify(response.data));
                return response.data;
            }
        });
    } else {
        return JSON.parse(userJsonStr);
    }
}

/**
 * 获取菜单信息
 */
function getMenu() {
    $.ajax({
        url: window.config.api + '/user/getMenu',
        method: "GET",
        async: false,
        success: function (response) {
            if (response.errorCode == 200) {
                $('#placeholder').remove();
                drawMenu(response);
            }
        }
    });
}

function drawMenu(response) {
    let a;
    let filename = location.href;
    filename = filename.substr(filename.lastIndexOf('/') + 1);
    let reg = ".*.html*";
    if (filename.match(reg)) {
        filename = filename.match(reg)[0];
    }
    // console.info("当前页：" + filename);
    // TODO 如果当前页不在配置的菜单中，提示未授权，无法访问，跳转到index

    let ul = $("ul#accordionSidebar");

    // 首部
    let top = $('<a class="sidebar-brand d-flex align-items-center justify-content-center"></a>');
    if (filename == 'index.html') {
        top.attr('href', '#');
    } else {
        top.attr('href', 'index.html');
    }
    let topDiv = $('<div class="sidebar-brand-icon"><i class="fas fa-graduation-cap"></i></div>');
    let topNameDiv = $('<div class="sidebar-brand-text mx-3">' + window.config.appName + '<sup>2</sup></div>');
    top.append(topDiv, topNameDiv);

    // ul.append(top);
    // 首部现在是用jquery获取元素改值的，所以这里不需要append上

    let arr = response.data;
    for (let i = 0; i < arr.length; i++) {
        let element = arr[i];
        // console.info(i);
        // console.info(element);
        // console.info(element.url);
        let li = $('<li class="nav-item"></li>');
        if (element.url) { //一级菜单
            if (filename == element.url) {
                li.addClass("active");
            }
            a = $('<a class="nav-link" href="' + element.url + '"><i class="' + element.icon + '"></i><span> ' + element.name + '</span></a>');
            li.append(a);

        } else { // 二级菜单

            a = $('<a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsePages' + i + '" aria-expanded="false" aria-controls="#collapsePages' + i + '"></a>');
            a.append($('<i class="' + element.icon + '"></i>'));
            a.append($('<span> ' + element.name + '</span>'));

            let div = $('<div id="#collapsePages' + i + '" class="collapse" aria-labelledby="#collapsePages' + i + '" data-parent="#accordionSidebar"></div>');
            let innerDiv = $('<div class="bg-white py-2 collapse-inner rounded"></div>');
            if (element.childMenus) {
                element.childMenus.forEach(child => {
                    let innerA = $('<a class="collapse-item" href="' + child.url + '"> ' + child.name + '</a>');
                    if (filename == child.url) {
                        innerA.addClass("active");
                        div.addClass("show");
                        li.addClass("active");
                        a.removeClass("collapsed");
                        a.attr("aria-expanded", true);
                    }
                    innerDiv.append(innerA);
                })
            }
            div.append(innerDiv);
            li.append(a);
            li.append(div);
        }
        ul.append(li);
        // 分隔符
        ul.append($('<hr class="sidebar-divider d-none d-md-block">'));
    }
    ul.append($('<div class="text-center d-none d-md-inline"><button class="rounded-circle border-0" id="sidebarToggle"></button></div>'));
}

$(document).on("click", "li.nav-item", function () {
    if ($(this).children('div').length > 0) {
        if ($(this).children('div').first().attr('class').indexOf('show') <= 0) {
            $(this).children('div').first().addClass('show');
            $(this).children('a').first().removeClass('collapsed');
        } else {
            $(this).children('div').first().removeClass('show');
            $(this).children('a').first().addClass('collapsed');
        }
    }
})

/**
 * 为菜单绑定事件
 */
$(document).on('click', "#sidebarToggle, #sidebarToggleTop", function () {
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
    if ($(".sidebar").hasClass("toggled")) {
        $('.sidebar .collapse').collapse('hide');
    }
})