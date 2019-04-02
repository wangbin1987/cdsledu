$("div#productName").html(window.config.appName);

$(document).on("click", "button#logoutBtn", function () {
    logout();
})

function logout() {
    $.ajax({
        url: window.config.api + '/user/logout',
        method: "POST",
        success: function (response) {
            localStorage.removeItem("user-info");
            localStorage.removeItem(window.config.token);
            window.location = "./login.html";
        }
    });
}

/**
 * 获取用户信息
 */
function getUserInfo() {
    $.ajax({
        url: window.config.api + '/user/getUserInfo',
        method: "GET",
        success: function (response) {
            if (response.errorCode == 401) {
                toastr.warning(response.message);
                setTimeout(function () {
                    window.location = "./login.html";
                }, 1500)
            }
            // console.info(response)
            let nickname = response.data.nickname;
            if (typeof nickname == "undefined" || nickname == null || nickname == "") {
                $("#nickname").text(response.data.username);
            } else {
                $("#nickname").text(nickname);
            }
            localStorage.setItem("user-info", JSON.stringify(response.data));
        }
    });
}

/**
 * 获取用户角色
 */
function getUserRole() {
    let userJson = localStorage.getItem("user-info");
    return JSON.parse(userJson).role;
}

// 验证中文名称
function isChinaName(name) {
    let pattern = /^[\u4E00-\u9FA5]{1,6}$/;
    return pattern.test(name);
}

// 验证手机号
function isPhoneNo(phone) {
    let pattern = /^1[34578]\d{9}$/;
    return pattern.test(phone);
}

// 验证身份证
function isCardNo(card) {
    let pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return pattern.test(card);
}

/**
 * 获取菜单信息
 */
function getMenu() {
    $.ajax({
        url: window.config.api + '/user/getMenu',
        method: "GET",
        success: function (response) {
            // console.info(response);
            $('#postionHave').remove();
            drawMenu(response);
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
    let topDiv = $('<div class="sidebar-brand-icon rotate-n-15"><i class="fas fa-laugh-wink"></i></div>');
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

$(document).on('click', "#sidebarToggle, #sidebarToggleTop", function () {
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
    if ($(".sidebar").hasClass("toggled")) {
        $('.sidebar .collapse').collapse('hide');
    }
})
