$().ready(function () {
    $("#loginForm").validate({
        rules: {
            username: {
                required: true,
            },
            password: {
                required: true,
            }
        },
        messages: {
            username: {
                required: "请输入用户名"
            },
            password: {
                required: "请输入密码"
            }
        },
        submitHandler: function () {
            let username = $("#username").val().trim();
            let password = $("#password").val().trim();
            rememberUsername();
            doLogin(username, password);
        }
    });

    console.info("记住我cookie:" + $.cookie("rememberMe"));
    if ($.cookie("rememberMe") == "true") {
        $("#rememberMe").attr("checked", true);
        $("#username").val($.cookie("usernameCookie"));
    }

    // 记住用户名
    function rememberUsername() {
        // 如果选中了记住我
        if ($('#rememberMe').is(':checked') == true) {
            let usernameCookie = $("#username").val().trim();
            $.cookie("rememberMe", "true", {
                expires: 7
            }); // 存储一个带7天期限的 cookie
            $.cookie("usernameCookie", usernameCookie, {
                expires: 7
            }); // 存储一个带7天期限的 cookie
        } else {
            $.cookie("rememberMe", "false", {
                expires: -1
            });
            $.cookie("usernameCookie", "", {
                expires: -1
            });
        }
    }

});

function doLogin(username, password) {
    $.ajax({
        url: window.config.api + '/user/login',
        method: "POST",
        data: JSON.stringify({
            "username": username,
            "password": password
        }),
        success: function (response) {
            // console.info(response);
            if (response.errorCode == 200) {
                localStorage.setItem(window.config.token, response.data);
                window.location = "./index.html";
            }
        }
    });
}
