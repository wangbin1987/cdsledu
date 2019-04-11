$(function () {
    let welcome = '';
    let user = getUserInfo();
    if (isEmpty(user)) {
        user = getUserInfo();
    }
    console.info("首页用户信息：" + JSON.stringify(user));
    if (isEmpty(user.nickname)) {
        welcome += user.username;
    } else {
        welcome += user.nickname;
    }
    let role = user.role;
    if (typeof role == "undefined" || role == null || role == "") {
    } else {
        welcome = welcome + " [" + role + "] "
    }
    $("#welcome").text(welcome);

    let myDate = new Date;
    let year = myDate.getFullYear(); //获取当前年
    let mon = myDate.getMonth() + 1; //获取当前月
    let date = myDate.getDate(); //获取当前日
    let week = myDate.getDay();
    let weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    // console.log(year, mon, date, weeks[week])
    $("#time").html(year + "年" + mon + "月" + date + "日" + '，' + weeks[week]);
})