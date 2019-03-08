$().ready(function () {
// 在键盘按下并释放及提交后验证提交表单
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
            doLogin(username, password);
        }
    });
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
