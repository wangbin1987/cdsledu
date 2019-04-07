$(function () {
    let welcome = '';
    let userJsonStr = localStorage.getItem("user-info");
    console.info("userJsonStr：" + userJsonStr)
    if (isEmpty(userJsonStr)) {
        getUserInfo();
        if (!isEmpty(localStorage.getItem("user-info"))) {
            window.location.reload();
        }
    }
    userJsonStr = localStorage.getItem("user-info");
    let user = JSON.parse(userJsonStr);
    let nickname = user.nickname;
    if (isEmpty(nickname)) {
        welcome += user.username;
    } else {
        welcome += nickname;
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
    console.log(year, mon, date, weeks[week])
    $("#time").html(year + "年" + mon + "月" + date + "日" + '，' + weeks[week]);
})