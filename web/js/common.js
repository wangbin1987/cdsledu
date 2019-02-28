function getUserInfo() {
    $.ajax({
        url: window.config.api + '/user/getUserInfo',
        method: "GET",
        success: function (response) {
            if (response.errorCode == 401) {
                alert(response.message);
                window.location = "./login.html";
            }
            console.info(response)
            var nickname = response.data.nickname;
            if (typeof nickname == "undefined" || nickname == null || nickname == "") {
                $("#nickname").text(response.data.username);
            } else {
                $("#nickname").text(nickname);
            }
        }
    });
}

$("#logoutModal a.btn.btn-primary").click(function () {
    logout();
})

function logout() {
    $.ajax({
        url: window.config.api + '/user/logout',
        method: "POST",
        success: function (response) {
            console.info(response);
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
            console.info(response);
            $('#postionHave').remove();
            drawMenu(response);
        }
    });
}

function drawMenu(response) {

    var filename = location.href;
    filename = filename.substr(filename.lastIndexOf('/') + 1);
    console.info(filename);

    var ul = $("ul#accordionSidebar");



    // 首部
    var top = $('<a class="sidebar-brand d-flex align-items-center justify-content-center"></a>');
    if (filename == 'index.html') {
        top.attr('href', '#');
    } else {
        top.attr('href', 'index.html');
    }
    var div = $('<div class="sidebar-brand-icon rotate-n-15"><i class="fas fa-laugh-wink"></i></div>');

    var nameDiv = $('<div class="sidebar-brand-text mx-3">' + window.config.appName + '<sup>2</sup></div>');

    top.append(div, nameDiv);

    // ul.append(top);


    var arr = response.data;
    arr.forEach(element => {
        console.info(element);
        var li = $('<li class="nav-item"></li>');
        if (element.url) {
            if (filename == element.url) {
                li.addClass("active");
            }
            var a = $('<a class="nav-link" href="' + element.url + '"><i class="' + element.icon + '"></i><span> ' + element.name + '</span></a>');
            li.append(a);

        } else {

            var a = $('<a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsePages" aria-expanded="true" aria-controls="collapsePages"></a>');
            a.append($('<i class="' + element.icon + '"></i>'));
            a.append($('<span> ' + element.name + '</span>'));
            li.append(a);

            var div = $('<div id="collapsePages" class="collapse" aria-labelledby="headingPages" data-parent="#accordionSidebar"></div>');
            var innerDiv = $('<div class="bg-white py-2 collapse-inner rounded"></div>');
            if (element.childMenus) {
                element.childMenus.forEach(child => {
                    var innerA = $('<a class="collapse-item" href="' + child.url + '">' + child.name + '</a>');
                    if (filename == child.url) {
                        innerA.addClass("active");
                        li.addClass("active");
                    }
                    innerDiv.append(innerA);
                })
                div.append(innerDiv);
            }
            li.append(div);
        }
        ul.append(li);
        ul.append($('<hr class="sidebar-divider d-none d-md-block">'));
    });

}