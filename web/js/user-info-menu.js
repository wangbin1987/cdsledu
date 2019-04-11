window.onload = function () {
    // 获取用户菜单
    getMenu();
    // 加载头部
    $("nav#top").load("top.html", function () {
        // 获取用户信息
        let user = getUserInfo();
        if (isEmpty(user)) {
            user = getUserInfo();
        }
        if (isEmpty(user.nickname)) {
            $("#nickname").text(user.username);
        } else {
            $("#nickname").text(user.nickname);
        }
    });
    // 加载底部
    $("footer#footer").load("footer.html");


}