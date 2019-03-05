$(function () {
    // 获取用户信息
    getUserInfo();
    // 获取用户菜单
    getMenu();
    // 加载头部
    $("nav#top").load("top.html");
    // 加载底部
    $("footer#footer").load("footer.html");
});