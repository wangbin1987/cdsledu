function getUserInfo() {
    $.ajax({
        url: window.config.api + '/user/getUserInfo',
        method: "GET",
        success: function (response) {
            if (response.errorCode == 401) {
                alert(response.message);
                window.location = "./login.html";
            }
            // console.info(response)
            var nickname = response.data.nickname;
            if (typeof nickname == "undefined" || nickname == null || nickname == "") {
                $("#nickname").text(response.data.username);
            } else {
                $("#nickname").text(nickname);
            }
        }
    });
}

$("div#productName").html(window.config.appName);

$("body").on("click", "button#logoutBtn", function () {
    logout();
})

function logout() {
    $.ajax({
        url: window.config.api + '/user/logout',
        method: "POST",
        success: function (response) {
            // console.info(response);
            localStorage.removeItem(window.config.token);
            window.location = "./login.html";
        }
    });
}

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

    var filename = location.href;
    filename = filename.substr(filename.lastIndexOf('/') + 1);
    // console.info("当前页：" + filename);

    var ul = $("ul#accordionSidebar");

    // 首部
    var top = $('<a class="sidebar-brand d-flex align-items-center justify-content-center"></a>');
    if (filename == 'index.html') {
        top.attr('href', '#');
    } else {
        top.attr('href', 'index.html');
    }
    var topDiv = $('<div class="sidebar-brand-icon rotate-n-15"><i class="fas fa-laugh-wink"></i></div>');
    var topNameDiv = $('<div class="sidebar-brand-text mx-3">' + window.config.appName + '<sup>2</sup></div>');
    top.append(topDiv, topNameDiv);

    // ul.append(top);
    // 首部现在是用jquery获取元素改值的，所以这里不需要append上

    var arr = response.data;
    for (var i = 0; i < arr.length; i++) {
        var element = arr[i];
        // console.info(i);
        // console.info(element);
        // console.info(element.url);
        var li = $('<li class="nav-item"></li>');
        if (element.url) { //一级菜单
            if (filename == element.url) {
                li.addClass("active");
            }
            var a = $('<a class="nav-link" href="' + element.url + '"><i class="' + element.icon + '"></i><span> ' + element.name + '</span></a>');
            li.append(a);

        } else { // 二级菜单

            var a = $('<a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsePages' + i + '" aria-expanded="false" aria-controls="#collapsePages' + i + '"></a>');
            a.append($('<i class="' + element.icon + '"></i>'));
            a.append($('<span> ' + element.name + '</span>'));

            var div = $('<div id="#collapsePages' + i + '" class="collapse" aria-labelledby="#collapsePages' + i + '" data-parent="#accordionSidebar"></div>');
            var innerDiv = $('<div class="bg-white py-2 collapse-inner rounded"></div>');
            if (element.childMenus) {
                element.childMenus.forEach(child => {
                    var innerA = $('<a class="collapse-item" href="' + child.url + '"> ' + child.name + '</a>');
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
    $(document).on("click", "li.nav-item", function () {

        if ($(this).children('div').first().attr('class').indexOf('show') <= 0) {
            $(this).children('div').first().addClass('show');
            $(this).children('a').first().removeClass('collapsed');
        } else {
            $(this).children('div').first().removeClass('show');
            $(this).children('a').first().addClass('collapsed');
        }

    });
}