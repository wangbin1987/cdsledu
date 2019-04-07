$(function () {
    // 获取用户菜单
    getMenu();
    // 加载头部
    $("nav#top").load("top.html", function () {
        // 获取用户信息
        getUserInfo();
        let userJson = JSON.parse(localStorage.getItem("user-info"));
        let nickname = userJson.nickname;
        if (isEmpty(nickname)) {
            $("#nickname").text(userJson.username);
        } else {
            $("#nickname").text(nickname);
        }
    });
    // 加载底部
    $("footer#footer").load("footer.html");


});