$("a#btnLogin").click(function () {
    var username = $("#username").val().trim();
    var password = $("#password").val().trim();
    if (username.length == 0 && password.length == 0) {
        alert("用户名，密码不能为空");
        return;
    }
    if (username.length == 0) {
        alert("用户名不能为空!");
        return;
    }
    if (username.length == 0) {
        alert("密码不能为空1");
        return;
    }
    doLogin(username, password);

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
            console.info(response);
            if (response.errorCode == 200) {
                localStorage.setItem(window.config.token, response.data);
                console.info(localStorage.getItem(window.config.token));
                window.location = "./index.html";
            } 
        }
    });
}
