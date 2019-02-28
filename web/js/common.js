$(
    $.ajaxSetup({
        contentType: 'application/json; charset=utf-8',
        beforeSend: function (xhr) {
            if (localStorage.getItem(window.config.token)) {
                xhr.setRequestHeader(window.config.token, localStorage.getItem(window.config.token));
            }
        },
        dataType:"json",
        complete: function (xhr, ts) {
            console.log("ajax complete");
            if (xhr.status == 200) {
                if (xhr.responseJSON.errorCode != 200) {
                    if (xhr.responseJSON.errorCode == 401) {
                        console.log("未登录");
                        alert(xhr.responseJSON.message);
                        sleep(10000);
                        window.location = "./login.html";
                    } else {
                        alert(xhr.responseJSON.message);
                    }
                }
            }
        }
    })
)

function sleep(d) {
    var t = Date.now();
    while (Date.now - t <= d);
}
function getUserInfo() {
    $.ajax({
        url: window.config.api + '/user/getUserInfo',
        method: "GET",
        success: function (response) {
            if (response.errorCode == 401) {
                alert(response.message);
                sleep(500);
                window.location = "./login.html";
            }
            console.info(response)
            var nickname = response.data.nickname;
            console.info(nickname);
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