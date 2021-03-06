$(function () {
    let welcome = '';
    let user = getUserInfo();
    if (isEmpty(user)) {
        user = getUserInfo();
    }
    // console.info("首页用户信息：" + JSON.stringify(user));
    if (isEmpty(user.nickname)) {
        welcome += user.username;
    } else {
        welcome += user.nickname;
    }
    let role = user.role;
    if (!isEmpty(role)) {
        welcome = "<strong>" + welcome + "</strong> [" + role + "]"
    }

    welcome += " 您好，欢迎您登陆双流区教育管理系统。</p>";

    let myDate = new Date;
    let year = myDate.getFullYear(); //获取当前年
    let mon = myDate.getMonth() + 1; //获取当前月
    let date = myDate.getDate(); //获取当前日
    let week = myDate.getDay();
    let weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    // console.log(year, mon, date, weeks[week])
    $("#time").html(year + "年" + mon + "月" + date + "日" + '，' + weeks[week]);

    welcome += ("今天是" + year + "年" + mon + "月" + date + "日" + '，' + weeks[week] + "</p>");

    $.ajax({
        url: window.config.api + '/article/getArticle?id=1',
        method: "GET",
        async: false,
        success: function (response) {
            if (response.errorCode == 200) {
                welcome += (response.data.content);
            }
        }
    });
    $("#welcome").before(welcome);
})