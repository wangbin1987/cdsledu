// 全国省市区 组件联动
$("#target").distpicker({
    autoSelect: true,
    placeholder: false
})

// 居住所属社区 的街道->社区数据联动
$.ajax({
    url: window.config.api + '/system/getDistrict',
    method: "GET",
    async: false,
    success: function (response) {
        for (let i = 0; i < response.data.length; i++) {
            $("#town").append($("<option data-value=" + response.data[i].name + "></option>").val(i + 1).html(response.data[i].name));
        }
        // 为省份下拉列表绑定change事件
        $("#town").change(function () {
            let index = $(this).val() - 1;// 获取当前省的下标
            $("#village").prop("length", 1);// 清空原有的数据
            if (response.data[index]) {
                for (let i = 0; i < response.data[index].addresses.length; i++) {//重新为市赋值
                    $("#village").append($("<option data-value=" + response.data[index].addresses[i].name + "></option>").val(i + 1).html(response.data[index].addresses[i].name));
                }
            }
        });
    }
})

// 当前操作类型，没有type就是新增，view查看，edit修改，approve审核
let type = getUrlParam("type");

// 新增页面
if (isEmpty(type)) {
    $("#editTr").show();
    if (getUserInfo().role != '街道办') {
        toastr.warning("无权操作");
        setView();
        $("#submitBtn").text("无权操作")
    }
}

// 默认居住就读
$("#rents").trigger("click");
$("#point").hide();


// 就读方式改变时显示和隐藏 积分就读和居住就读的相关数据项
$("input[type=radio][name=jdfs]").change(function () {
    // 积分就读
    if (this.value === "points") {
        // 积分模块
        $("#point").show();
        $("#rent").hide();
        $("#company").hide();

        // 证件类别所在行
        $("input[type='radio'][name='idType']").parent().hide();
        $("input[type='radio'][name='idType']").parent().prev().hide();
        $("#jzzname").text("居住证编号");
        $("#rentNum").parent().hide();
        $("#rentNum").parent().prev().hide();


        $("#socialId").parent().hide();
        $("#socialId").parent().prev().hide();
        $("input[type='radio'][name='payMethod']").parent().hide();
        $("input[type='radio'][name='payMethod']").parent().prev().hide();
    } else if (this.value === "rents") {
        $("#point").hide();
        $("#rent").show();
        $("#company").show();

        // 证件类别所在行
        $("input[type='radio'][name='idType']").parent().show();
        $("input[type='radio'][name='idType']").parent().prev().show();
        $("#jzzname").text("证件编号");
        $("#rentNum").parent().show();
        $("#rentNum").parent().prev().show();


        $("#socialId").parent().show();
        $("#socialId").parent().prev().show();
        $("input[type='radio'][name='payMethod']").parent().show();
        $("input[type='radio'][name='payMethod']").parent().prev().show();
    }
});

// 一年级不显示学籍号
$("#grade").change(function () {
    let grade = $.trim($("#grade").val());
    if (!isEmpty(grade)) {
        if (grade == '一年级') {
            $("#xjh").parent().hide();
            $("#xjh").parent().prev().hide();
        } else {
            $("#xjh").parent().show();
            $("#xjh").parent().prev().show();
        }
    }
})

// 根据id获取数据并绑定显示
let id = getUrlParam("id");
if (id) {
    $.ajax({
        url: window.config.api + '/enrollment/getCompulsoryById/' + id,
        method: "GET",
        success: function (response) {
            console.info(response);
            if (response.errorCode != 200) {
                $("#editTr").show();
                if (getUserInfo().role != '街道办') {
                    $("#submitBtn").text("无权操作")
                    $("#submitBtn").attr("disabled", "disabled")
                }
                return;
            }

            $("#guarder").val(response.data.guarderName);
            $("#guarder").attr('title', response.data.guarderName);
            $("#guarderId").val(response.data.guarderIdentityNumber);
            $("#guarderId").attr('title', response.data.guarderIdentityNumber);
            $("#telephone").val(response.data.telephone);
            $("#telephone").attr('title', response.data.telephone);

            if (response.data.residenceType == '居住证') {
                $("input[name='idType'][value='jzz']").attr("checked", true);
            } else {
                $("input[name='idType'][value='jzdjzm']").attr("checked", true);
            }
            // 证件编号
            $("#jzzid").val(response.data.residenceNumber);
            $("#jzzid").attr('title', response.data.residenceNumber);
            // 租房备案号
            $("#rentNum").val(response.data.rentNumber);
            $("#rentNum").attr('title', response.data.rentNumber);

            // 居住详细地址
            $("#idAddress").val(response.data.residenceAddress);
            $("#idAddress").attr('title', response.data.residenceAddress);
            if (response.data.rentAddressZone) {
                let zone = response.data.rentAddressZone.split("|");
                $("#town option").each(function () {
                    let val = $(this).val();
                    let text = $(this).attr('data-value');
                    // console.info(text);
                    if (text == zone[0]) {
                        $("#town").val(val);
                    }
                })
                $("#town").trigger("change");
                $("#village option").each(function () {
                    let val = $(this).val();
                    let text = $(this).attr('data-value');
                    // console.info(text);
                    if (text == zone[1]) {
                        $("#village").val(val);
                    }
                })
            }

            if (response.data.guarderType == '单位职工') {
                $("input[name='workType'][value='dwzg']").attr("checked", true);
            } else {
                $("input[name='workType'][value='gtgsh']").attr("checked", true);
            }

            // 积分
            $("#live_point").val(response.data.livePoint);
            $("#social_point").val(response.data.socialPoint);
            $("#total_point").val(response.data.totalPoint);

            // 单位名称
            $("#companyName").val(response.data.company);
            $("#companyName").attr('title', response.data.company);
            // 单位地址
            $("#companyAddress").val(response.data.companyAddress);
            $("#companyAddress").attr('title', response.data.companyAddress);
            // 社会信用代码
            $("#companyId").val(response.data.companySocialId);
            $("#companyId").attr('title', response.data.companySocialId);
            // 社保缴纳方式
            if (response.data.socialSecurityPayMethod == '单位') {
                $("input[name='payMethod'][value='dw']").attr("checked", true);
            } else {
                $("input[name='payMethod'][value='gr']").attr("checked", true);
            }
            // 社保编号
            $("#socialId").val(response.data.socialSecurityId);
            $("#socialId").attr('title', response.data.socialSecurityId);

            // 学生姓名
            $("#xsName").val(response.data.studentName);
            $("#xsName").attr('title', response.data.studentName);
            $("#xsId").val(response.data.studentIdentityNumber);
            $("#xsId").attr('title', response.data.studentIdentityNumber);
            if (response.data.studentGender == '男') {
                $("input[name='xsGender'][value='male']").attr("checked", true);
            } else {
                $("input[name='xsGender'][value='female']").attr("checked", true);
            }

            // 申请入学年级
            $("#grade").find("option:contains(" + response.data.studentGrade + ")").attr("selected", true);
            if (response.data.studentGrade == '一年级') {
                $("#xjh").parent().hide();
                $("#xjh").parent().prev().hide();
            }
            // 学籍号
            $("#xjh").val(response.data.studentSchoolRoll);
            $("#xjh").attr('title', response.data.studentSchoolRoll);

            // 户籍地址
            let addr = response.data.studentHousehold.split("|");
            $("#provinceName").val(addr[0]);
            $("#provinceName").trigger("change");
            $("#cityName").val(addr[1]);
            $("#cityName").trigger("change");
            $("#districtName").val(addr[2]);
            $("#districtName").trigger("change");

            // 备注
            $("#bz").val(response.data.comment);
            // 切换就读方式
            if (response.data.type == '2') {
                $("#points").trigger("click");
            } else {
                $("#rents").trigger("click");
            }

            // 显示操作历史
            let htmlStr = '';
            if (response.data.histories) {
                response.data.histories.forEach(his => {
                    let status = '';
                    if (his.status == 0) {
                        status = '&nbsp;录入信息';
                    }
                    if (his.status == 3) {
                        status = '&nbsp;修改信息';
                    }
                    if (his.status == 4) {
                        status = '&nbsp;提交重审';
                    }
                    if (his.status == 1) {
                        status = '<span class="label label-success">审核通过</span>';
                        if (his.comment) {
                            status = status + "&nbsp;&nbsp;审核意见：<span class='label label-info'>" + his.comment + "</span>";
                        }
                    }
                    if (his.status == 2) {
                        status = '<span class="label label-danger">审核不通过</span>';
                        if (his.comment) {
                            status = status + "&nbsp;&nbsp;审核意见：<span class='label label-info'>" + his.comment + "</span>";
                        }
                    }
                    let username = his.username;
                    if (username != his.department) {
                        if (!isEmpty(his.department)) {
                            username = his.department + '&nbsp;&nbsp;' + his.username;
                        }
                    }
                    htmlStr = htmlStr + his.createTime + '；' + username + ' ' + status + '<br>';
                });
                $("#comment").after($("<tr><td>操作历史：</td><td colspan='5'>" + htmlStr + "</td></tr>"))
            }

            let type = getUrlParam("type");
            if (type == 'edit') {
                $("#editTr").show();
                if (response.data.canEdit) {
                    $(":input").removeAttr("disabled");
                    $("#submitBtn").text(response.data.editBtn);
                } else {
                    $("#submitBtn").text(response.data.editBtn);
                    setView();
                }
            } else if (type == 'approve') {
                $("#approveTr").show();
                setView();
                if (response.data.canApprove) {
                    $("input[type='radio'][name='shjg']").removeAttr("disabled");
                    $("#shyj").removeAttr("disabled");
                    $("#approveBtn").removeAttr("disabled");
                } else {
                    $("#approveBtn").text(response.data.approveBtn);
                }
            } else {
                setView();
            }
        }
    });
}

function setView() {
    $(":input").attr("disabled", "disabled");
    $("#logoutBtn").attr("disabled", false);
}

// 积分计算
function point() {
    let livePoint = $("#live_point").val();
    let socialPoint = $("#social_point").val();
    console.info("livePoint:" + livePoint);
    console.info("socialPoint:" + socialPoint);
    let total_point = livePoint * 1 + socialPoint * 1;
    $("#total_point").val(total_point);
}

// 积分数字校验
$("#live_point,#social_point").keyup(function () {
    let value = $(this).val();
    console.info(value);
    if (!isNumber(value)) {
        if (value.length >= 1 && value != '0') {
            toastr.warning('只能输入数字');
            $(this).val('');
        }
    }
});

// 验证函数
function formValidate(submit) {

    let type = $("input[type='radio'][name='jdfs']:checked").val();
    if (type === 'rents') {
        type = 1;
    } else {
        type = 2;
    }

    let guarderName = $.trim($("#guarder").val());
    if (isEmpty(guarderName)) {
        toastr.warning("请输入证件持有人姓名");
        $("#guarder").focus();
        return;
    } else {
        if (!isChinaName(guarderName)) {
            toastr.warning("证件持有人姓名格式不正确");
            $("#guarder").focus();
            return;
        }
    }

    let guarderIdentityNumber = $.trim($("#guarderId").val());
    if (isEmpty(guarderIdentityNumber)) {
        toastr.warning("请输入证件持有人身份证");
        $("#guarderId").focus();
        return;
    } else {
        if (!isCardNo(guarderIdentityNumber)) {
            toastr.warning("证件持有人身份证格式不正确");
            $("#guarderId").focus();
            return;
        }
    }

    let telephone = $.trim($("#telephone").val());
    if (isEmpty(telephone)) {
        toastr.warning("请输入联系电话");
        $("#telephone").focus();
        return;
    } else {
        if (!isTelephone(telephone)) {
            toastr.warning("联系电话格式不正确");
            $("#telephone").focus();
            return;
        }
    }

    let residenceType = $("input[type='radio'][name='idType']:checked").val();
    if (residenceType === 'jzz') {
        residenceType = '居住证';
    } else {
        residenceType = '居住登记证明';
    }

    // 证件编号
    let residenceNumber = $.trim($("#jzzid").val());

    // 租房备案号 非必填
    let rentNumber = $.trim($("#rentNum").val());

    // 居住详细地址 社区，街道 ，详细地址 ，租房备案号
    let town = $("#town").find("option:selected").data("value");
    let village = $("#village").find("option:selected").data("value");
    let residenceAddressZone = town + "|" + village;

    let residenceAddress = $.trim($("#idAddress").val());

    // 住址
    if (isEmpty(town) || isEmpty(village)) {
        toastr.warning("请选择住址详细地址");
        if (isEmpty(town)) {
            $("#town").focus();
        } else {
            $("#village").focus();
        }
        return;
    }
    if (isEmpty(residenceAddress)) {
        toastr.warning("请输入住址详细地址");
        $("#idAddress").focus();
        return;
    }

    // 人员类型
    let guarderType = $("input[type='radio'][name='workType']:checked").val();
    if (guarderType === 'dwzg') {
        guarderType = '单位职工';
    } else {
        guarderType = '个体工商户';
    }

    let company = $.trim($("#companyName").val());
    let companyAddress = $.trim($("#companyAddress").val());
    let companySocialId = $.trim($("#companyId").val());


    let socialSecurityPayMethod = $("input[type='radio'][name='payMethod']:checked").val();
    if (socialSecurityPayMethod == 'dw') {
        socialSecurityPayMethod = '单位';
    } else {
        socialSecurityPayMethod = '个人';
    }
    let socialSecurityId = $.trim($("#socialId").val());

    let livePoint = $.trim($("#live_point").val());
    let socialPoint = $.trim($("#social_point").val());
    let totalPoint = $.trim($("#total_point").val());


    if (type == 1) {

        // 证件编号
        if (isEmpty(residenceNumber)) {
            toastr.warning("请输入证件编号");
            $("#jzzid").focus();
            return;
        }

        // 单位名称
        if (isEmpty(company)) {
            toastr.warning("请输入单位名称");
            $("#companyName").focus();
            return;
        }

        // 单位地址
        if (isEmpty(companyAddress)) {
            toastr.warning("请输入单位地址");
            $("#companyAddress").focus();
            return;
        }

        // 社会信用代码
        if (isEmpty(companySocialId)) {
            toastr.warning("请输入社会信用代码");
            $("#companyId").focus();
            return;
        }

        // 社保编号
        let socialSecurityId = $("#socialId").val();
        if (isEmpty(socialSecurityId)) {
            toastr.warning("请输入社保编号");
            $("#socialId").focus();
            return;
        }
    } else {

        // 居住积分
        if (isEmpty(livePoint)) {
            toastr.warning("请输入居住积分");
            $("#live_point").focus();
            return;
        }

        // 社保积分
        if (isEmpty(socialPoint)) {
            toastr.warning("请输入社保积分");
            $("#social_point").focus();
            return;
        }

        // 人员类型
        guarderType = '';
        // 社保缴纳方式
        socialSecurityPayMethod = '';
    }


    let studentName = $.trim($("#xsName").val());
    if (isEmpty(studentName)) {
        toastr.warning("请输入学生姓名");
        $("#xsName").focus();
        return;
    } else {
        if (!isChinaName(studentName)) {
            toastr.warning("学生姓名格式不正确");
            $("#xsName").focus();
            return;
        }
    }

    let studentIdentityNumber = $.trim($("#xsId").val());
    if (isEmpty(studentIdentityNumber)) {
        toastr.warning("请输入学生身份证");
        $("#xsId").focus();
        return;
    } else {
        if (!isCardNo(studentIdentityNumber)) {
            toastr.warning("学生身份证格式不正确");
            $("#xsId").focus();
            return;
        }
    }

    let studentGender = $("input[type='radio'][name='xsGender']:checked").val();
    if (studentGender == 'male') {
        studentGender = '男'
    } else {
        studentGender = '女'
    }

    let grade = $("#grade").val();
    if (isEmpty(grade)) {
        toastr.warning("请选择申请入学年级");
        $("#grade").focus();
        return;
    } else {
        if (grade == '一年级') {
            $("#xjh").parent().hide();
            $("#xjh").parent().prev().hide();
        } else {
            $("#xjh").parent().show();
            $("#xjh").parent().prev().show();
        }
    }

    console.info("提交数据");
    // 下面的到提交的时候才校验

    // 学籍号
    let studentSchoolRoll = $.trim($("#xjh").val());
    if (grade != '一年级' && isEmpty(studentSchoolRoll)) {
        toastr.warning("请输入学籍号");
        $("#xjh").focus();
        return;
    } else {
        // 一年级出生年月日在2013年8月31日以后的不可以报名
        let birth = studentIdentityNumber.substring(6, 14);
        console.info("birthday:" + birth);
        let end = (new Date().getFullYear() - 6) + "0831";
        if (birth >= end) {
            toastr.warning("一年级只接收" + (new Date().getFullYear() - 6) + "年8月31日之前出生的学生");
            $("#xjh").focus();
            return;
        }

    }

    let studentHousehold = $("#provinceName").val() + "|" + $("#cityName").val() + "|" + $("#districtName").val();
    let comment = $.trim($("#bz").val());


    console.info("id:" + id);
    console.info("就读方式：" + type);
    console.info("证件持有人姓名：" + guarderName)
    console.info("证件持有人身份证：" + guarderIdentityNumber)
    console.info("联系电话：" + telephone)
    console.info("居住证件类型：" + residenceType)
    console.info("居住证件编码：" + residenceNumber)
    console.info("租房备案号：" + rentNumber)

    console.info("住址详细地址联动：" + residenceAddressZone)
    console.info("住址详细地址+手写：" + residenceAddress)


    console.info("居住积分:" + livePoint)
    console.info("社保积分:" + socialPoint)
    console.info("总积分:" + totalPoint)

    console.info("人员类型：" + guarderType)

    console.info("单位名称:" + company)
    console.info("单位地址:" + companyAddress)
    console.info("单位社会信用代码:" + companySocialId)
    console.info("社保缴纳方式:" + socialSecurityPayMethod)
    console.info("社保编码:" + socialSecurityId)

    console.info("学生姓名:" + studentName)
    console.info("学生身份证号:" + studentIdentityNumber)
    console.info("学生性别:" + studentGender)
    console.info("申请入学年级:" + grade)
    console.info("学籍号:" + studentSchoolRoll)
    console.info("户籍地址:" + studentHousehold)
    console.info("备注:" + comment)


    $.ajax({
        url: window.config.api + '/enrollment/addCompulsory',
        method: "POST",
        async: false,
        data: JSON.stringify({
            "id": id,
            "submit": submit,
            "type": type,
            "guarderName": guarderName,
            "guarderIdentityNumber": guarderIdentityNumber,
            "telephone": telephone,
            "residenceType": residenceType,
            "residenceNumber": residenceNumber,
            "residenceAddress": residenceAddress,
            "guarderType": guarderType,
            "rentNumber": rentNumber,
            "rentAddressZone": residenceAddressZone,
            "livePoint": livePoint,
            "socialPoint": socialPoint,
            "totalPoint": totalPoint,
            "company": company,
            "companyAddress": companyAddress,
            "companySocialId": companySocialId,
            "socialSecurityId": socialSecurityId,
            "socialSecurityPayMethod": socialSecurityPayMethod,
            "studentName": studentName,
            "studentIdentityNumber": studentIdentityNumber,
            "studentGender": studentGender,
            "studentGrade": grade,
            "studentSchoolRoll": studentSchoolRoll,
            "studentHousehold": studentHousehold,
            "comment": comment
        }),
        success: function (response) {
            if (response.errorCode == 200) {
                toastr.success(response.message);
                if (!id) {
                    if (submit == 1) {
                        let r = confirm("信息提交成功，是否打印回执？");
                        if (r == true) {
                            // window.location.replace("./blank2.html?id=" + response.data + "&type=edit");
                            window.open("./print-confirm.html?id=" + response.data);
                        }
                    }
                    window.location.replace("./compulsory.html");
                } else {
                    window.location = "./blank2.html?id=" + id + "&type=edit";
                }
            }
        }
    });
}

// 学生身份证校验以及和性别联动
$("#xsId").on('blur', function () {
    let idNumber = $.trim($("#xsId").val());
    if (isEmpty(idNumber)) {
        return;
    }
    if (!isCardNo(idNumber)) {
        toastr.warning("学生身份证格式不正确");
        $("#xsId").focus();
        return;
    }
    let gender = (parseInt(idNumber.substr(16, 1)) % 2 == 1);
    if (gender) {
        $("input[name='xsGender'][value='female']").attr("checked", false);
        $("input[name='xsGender'][value='male']").attr("checked", true);
    } else {
        $("input[name='xsGender'][value='male']").attr("checked", false);
        $("input[name='xsGender'][value='female']").attr("checked", true);
    }
})

/**
 * 点击提交按钮
 */
$('#submitBtn').on('click', function () {
    formValidate(1);
});


/**
 * 点击提交审核按钮
 */
$('#approveBtn').on('click', function () {
    if (isEmpty(id)) {
    } else {
        submitApprove();
    }
});

/**
 * 提交审核
 */
function submitApprove() {
    console.info("审核的id:" + id);
    // 审核结果 1通过 2不通过
    let approveResult = $("input[type='radio'][name='shjg']:checked").val();
    let approveComment = $.trim($("#shyj").val());
    // 不通过
    if (approveResult == '2') {
        if (isEmpty(approveComment)) {
            toastr.warning("请输入审核意见");
            $("#shyj").focus();
            return;
        }
    }
    $.ajax({
        url: window.config.api + '/enrollment/approveCompulsory',
        method: "POST",
        data: JSON.stringify({
            "id": id,
            "status": approveResult,
            "comment": approveComment
        }),
        success: function (response) {
            if (response.errorCode == 200) {
                toastr.success("审核成功");
                setTimeout(function () {
                    window.location = "./blank2.html?id=" + id + "&type=approve";
                }, 1500);
            }
        }
    });
}

// 有时候禁用会导致退出登录的按钮也被禁用
$("#logoutBtn").attr("disabled", false);