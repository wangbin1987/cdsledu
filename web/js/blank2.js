// 省市区联动
$("#target").distpicker({
    autoSelect: true,
    placeholder: false
})

// 加载住址所属社区数据联动
$.ajax({
    url: window.config.api + '/system/getDistrict',
    method: "GET",
    async: false,
    success: function (response) {
        console.info(response);
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

let type = getUrlParam("type");

if (isEmpty(type)) {
    $("#editTr").show();
    if (getUserRole() != '街道办') {
        $("#submit").text("无权操作")
        $("#submit").attr("disabled", "disabled")
        $("#submitApprove").hide();
    }
}

$("#point").hide();
$("input[type=radio][name=jdfs]").change(function () {
    if (this.value === "points") {
        $("#point").show();
        $("#rent").hide();
        $("#company").hide();
        // 居住登记证明
        $("input[type='radio'][name='idType']").parent().parent().hide();
        $("#socialId").parent().hide();
        $("#socialId").parent().prev().hide();
        $("input[type='radio'][name='payMethod']").parent().hide();
        $("input[type='radio'][name='payMethod']").parent().prev().hide();
    } else if (this.value === "rents") {
        $("#point").hide();
        $("#rent").show();
        $("#company").show();
        $("input[type='radio'][name='idType']").parent().parent().show();
        $("#socialId").parent().show();
        $("#socialId").parent().prev().show();
        $("input[type='radio'][name='payMethod']").parent().show();
        $("input[type='radio'][name='payMethod']").parent().prev().show();
    }
});

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
                if (getUserRole() != '街道办') {
                    $("#submit").text("无权操作")
                    $("#submit").attr("disabled", "disabled")
                }
                return;
            }

            $("#live_point").val(response.data.livePoint);
            $("#social_point").val(response.data.socialPoint);
            $("#total_point").val(response.data.totalPoint);

            $("#guarder").val(response.data.guarderName);
            $("#guarderId").val(response.data.guarderIdentityNumber);
            $("#telephone").val(response.data.telephone);

            if (response.data.residenceType == '居住证') {
                $("input[name='idType'][value='jzz']").attr("checked", true);
            } else {
                $("input[name='idType'][value='jzdjzm']").attr("checked", true);
            }
            $("#jzzid").val(response.data.residenceNumber);
            $("#idAddress").val(response.data.residenceAddress);
            if (response.data.guarderType == '单位职工') {
                $("input[name='workType'][value='dwzg']").attr("checked", true);
            } else {
                $("input[name='workType'][value='gtgsh']").attr("checked", true);
            }
            $("#rentNum").val(response.data.rentNumber);
            $("#companyName").val(response.data.company);
            $("#companyAddress").val(response.data.companyAddress);
            $("#companyId").val(response.data.companySocialId);
            $("#socialId").val(response.data.socialSecurityId);
            if (response.data.socialSecurityPayMethod == '单位') {
                $("input[name='payMethod'][value='dw']").attr("checked", true);
            } else {
                $("input[name='payMethod'][value='gr']").attr("checked", true);
            }
            $("#xsName").val(response.data.studentName);
            $("#xsId").val(response.data.studentIdentityNumber);
            if (response.data.studentGender == '男') {
                $("input[name='xsGender'][value='male']").attr("checked", true);
            } else {
                $("input[name='xsGender'][value='female']").attr("checked", true);
            }
            $("#grade").find("option:contains(" + response.data.studentGrade + ")").attr("selected", true);
            $("#xjh").val(response.data.studentSchoolRoll);
            $("#bz").val(response.data.comment);
            let addr = response.data.studentHousehold.split("|");
            $("#provinceName").val(addr[0]);
            $("#provinceName").trigger("change");
            $("#cityName").val(addr[1]);
            $("#cityName").trigger("change");
            $("#districtName").val(addr[2]);
            $("#districtName").trigger("change");

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
            // 切换就读方式
            if (response.data.type == '2') {
                $("#points").trigger("click");
                $("#point").show();
                $("#rent").hide();
                $("#company").hide();
            } else {
                $("#rents").trigger("click");
                $("#point").hide();
                $("#rent").show();
                $("#company").show();
            }

            // 显示操作历史
            let htmlStr = '';
            if (response.data.histories) {
                response.data.histories.forEach(his => {
                    let status = '';
                    if (his.status == 0) {
                        status = '录入信息';
                    }
                    if (his.status == 3) {
                        status = '修改信息';
                    }
                    if (his.status == 4) {
                        status = '提交重审';
                    }
                    if (his.status == 1) {
                        status = '审核通过';
                        if (his.comment) {
                            status = status + "；审核意见：" + his.comment;
                        }
                    }
                    if (his.status == 2) {
                        status = '审核不通过';
                        if (his.comment) {
                            status = status + "；审核意见：" + his.comment;
                        }
                    }
                    let username = his.username;
                    if (username != his.department) {
                        username = his.department + ' ' + his.username;
                    }
                    htmlStr = htmlStr + his.createTime + '；' + username + '：' + status + '<br>';
                });
                $("#comment").after($("<tr><td>操作历史：</td><td colspan='5'>" + htmlStr + "</td></tr>"))
            }

            let type = getUrlParam("type");
            if (type == 'edit') {
                $("#editTr").show();
                if (response.data.canEdit) {
                    $(":input").removeAttr("disabled");
                    if (response.data.status == 0) {
                        $("#submit").show();
                    }
                    if (response.data.approveCount > 3) {
                        $("#submit").hide();
                        $("#submitApprove").text(response.data.editBtn);
                    }
                } else {
                    $("#submit").text(response.data.editBtn);
                    $("#submitApprove").text(response.data.editBtn);
                    if (response.data.status == 1) {
                        $("#submit").hide();
                    }
                    setView();
                }
            } else if (type == 'approve') {
                $("#approveTr").show();
                setView();
                if (response.data.canApprove) {
                    $("input[type='radio'][name='shjg']").removeAttr("disabled");
                    $("#shyj").removeAttr("disabled");
                    $("#shenhetj").removeAttr("disabled");
                } else {
                    $("#shenhetj").text(response.data.approveBtn);
                }
            } else {
                setView();
            }
        }
    });
}

function setView() {
    $(":input").attr("disabled", "disabled");
}

function point() {
    let livePoint = $("#live_point").val();
    let socialPoint = $("#social_point").val();
    console.info("livePoint:" + livePoint);
    console.info("socialPoint:" + socialPoint);
    let total_point = livePoint * 1 + socialPoint * 1;
    $("#total_point").val(total_point);
}

$("#live_point,#social_point").keyup(function () {
    let value = $(this).val();
    console.info(value);
    if (!isNumber(value)) {
        toastr.warning('只能输入正整数');
        $(this).val('');
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

    let str = '';

    if ($.trim($("#guarder").val()).length === 0) {
        str += '请输入证件持有人姓名\n';
    } else {
        if (isChinaName($.trim($('#guarder').val())) === false) {
            str += '请输入合法的证件持有人姓名\n';
        }
    }

    if ($.trim($('#guarderId').val()).length === 0) {
        str += '请输入证件持有人身份证\n';
    } else {
        if (isCardNo($.trim($('#guarderId').val())) === false) {
            str += '证件持有人身份证格式不正确\n';
        }
    }

    // 判断手机号码
    if ($.trim($('#telephone').val()).length === 0) {
        str += '请输入联系电话\n';
    } else {
        if (isTelephone($.trim($('#telephone').val()) === false)) {
            str += '联系电话格式不正确\n';
        }
    }

    if (type == 1) {

        // 证件编码
        if ($.trim($('#jzzid').val()).length === 0) {
            str += '请输入证件编码\n';
        }

        // 证件住址
        if ($.trim($('#idAddress').val()).length === 0) {
            str += '请输入证件住址\n';
        }

        // 租房备案号
        if ($.trim($('#rentNum').val()).length === 0) {
            str += '请输入租房备案号\n';
        }
        // 住址所属社区
        let town = $("#town").find("option:selected").data("value");
        let village = $("#village").find("option:selected").data("value");
        if (isEmpty(town) || isEmpty(village)) {
            str += '请选择住址所属社区\n';
        }

        // 单位名称
        if ($.trim($('#companyName').val()).length === 0) {
            str += '请输入单位名称\n';
        }

        // 单位地址
        if ($.trim($('#companyAddress').val()).length === 0) {
            str += '请输入单位地址\n';
        }

        // 社会信用代码
        if ($.trim($('#companyId').val()).length === 0) {
            str += '请输入社会信用代码\n';
        }

        // 社保编码
        if ($.trim($('#socialId').val()).length === 0) {
            str += '请输入社保编码\n';
        }
    } else {
        if ($.trim($('#live_point').val()).length === 0) {
            str += '请输入居住积分\n';
        }

        if ($.trim($('#social_point').val()).length === 0) {
            str += '请输入社保积分\n';
        }
    }


    // 判断名称
    if ($.trim($("#xsName").val()).length === 0) {
        str += '请输入学生姓名\n';
    } else {
        if (isChinaName($.trim($('#xsName').val())) === false) {
            str += '请输入合法的学生姓名\n';
        }
    }

    // 验证身份证
    if ($.trim($('#xsId').val()).length === 0) {
        str += '学生身份证号码没有输入\n';
    } else {
        if (isCardNo($.trim($('#xsId').val())) === false) {
            str += '学生身份证号不正确\n';
        }
    }

    if ($.trim($('#grade').val()).length === 0) {
        str += '请选择申请入学年级\n';
    }

    if ($.trim($('#xjh').val()).length === 0) {
        str += '请输入学籍号\n';
    }

    // 如果没有错误则提交
    if (str !== '') {
        alert(str);
        return false;
    } else {
        console.info("提交数据");

        // 就读方式：1居住就读，2积分就读
        let type = $("input[type='radio'][name='jdfs']:checked").val();
        if (type === 'rents') {
            type = 1;
        } else {
            type = 2;
        }
        let guarderName = $("#guarder").val();
        let guarderIdentityNumber = $("#guarderId").val();
        let telephone = $("#telephone").val();
        let residenceType = $("input[type='radio'][name='idType']:checked").val();
        if (residenceType === 'jzz') {
            residenceType = '居住证';
        } else {
            residenceType = '居住登记证明';
        }
        // 居住证件编码
        let residenceNumber = $("#jzzid").val();
        let residenceAddress = $("#idAddress").val();

        let guarderType = $("input[type='radio'][name='workType']:checked").val();
        if (guarderType === 'dwzg') {
            guarderType = '单位职工';
        } else {
            guarderType = '个体工商户';
        }
        let rentNumber = $("#rentNum").val();
        let rentAddressZone = $("#town").find("option:selected").data("value") + "|" + $("#village").find("option:selected").data("value");
        let livePoint = $("#live_point").val();
        let socialPoint = $("#social_point").val();
        let totalPoint = $("#total_point").val();
        let company = $("#companyName").val();
        let companyAddress = $("#companyAddress").val();
        let companySocialId = $("#companyId").val();
        let socialSecurityId = $("#socialId").val();
        let socialSecurityPayMethod = $("input[type='radio'][name='payMethod']:checked").val();
        if (socialSecurityPayMethod == 'dw') {
            socialSecurityPayMethod = '单位';
        } else {
            socialSecurityPayMethod = '个人';
        }
        let studentName = $("#xsName").val();
        let studentIdentityNumber = $("#xsId").val();
        let studentGender = $("input[type='radio'][name='xsGender']:checked").val();
        if (studentGender == 'male') {
            studentGender = '男'
        } else {
            studentGender = '女'
        }
        let studentGrade = $("#grade").val();
        let studentSchoolRoll = $("#xjh").val();
        let studentHousehold = $("#provinceName").val() + "|" + $("#cityName").val() + "|" + $("#districtName").val();
        let comment = $("#bz").val();
        console.info("id:" + id);
        console.info("就读方式：" + type);
        console.info("证件持有人姓名：" + guarderName)
        console.info("证件持有人身份证：" + guarderIdentityNumber)
        console.info("联系电话：" + telephone)
        console.info("居住证件类型：" + residenceType)
        console.info("居住证件编码：" + residenceNumber)
        console.info("居住证上所写住址：" + residenceAddress)
        console.info("人员类型：" + guarderType)
        console.info("租房备案号：" + rentNumber)
        console.info("住址所属社区：" + rentAddressZone)
        console.info("居住积分:" + livePoint)
        console.info("社保积分:" + socialPoint)
        console.info("总积分:" + totalPoint)
        console.info("单位名称:" + company)
        console.info("单位地址:" + companyAddress)
        console.info("单位社会信用代码:" + companySocialId)
        console.info("社保编码:" + socialSecurityId)
        console.info("社保缴纳方式:" + socialSecurityPayMethod)
        console.info("学生姓名:" + studentName)
        console.info("学生身份证号:" + studentIdentityNumber)
        console.info("学生性别:" + studentGender)
        console.info("申请入学年级:" + studentGrade)
        console.info("学籍号:" + studentSchoolRoll)
        console.info("户籍地址:" + studentHousehold)
        console.info("备注:" + comment)

        if (type == 2) {
            rentAddressZone = '';
        }

        $.ajax({
            url: window.config.api + '/enrollment/addCompulsory',
            method: "POST",
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
                "rentAddressZone": rentAddressZone,
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
                "studentGrade": studentGrade,
                "studentSchoolRoll": studentSchoolRoll,
                "studentHousehold": studentHousehold,
                "comment": comment
            }),
            success: function (response) {
                if (response.errorCode == 200) {
                    toastr.success(response.message);
                    if (!id) {
                        if (submit == 1) {
                            let r = confirm("是否打印回执!");
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
}

$('#submit').on('click', function () {
    formValidate(0);
});

$('#submitApprove').on('click', function () {
    formValidate(1);
});

$('#shenhetj').on('click', function () {
    submitApprove();
});

function submitApprove() {
    console.info("id" + id);
    let shjg = $("input[type='radio'][name='shjg']:checked").val();
    let shyj = $("#shyj").val();
    if (shjg == 2) {
        if (shyj.length == 0) {
            toastr.warning("请输入审核意见");
            return;
        }
    }
    $.ajax({
        url: window.config.api + '/enrollment/approveCompulsory',
        method: "POST",
        data: JSON.stringify({
            "id": id,
            "status": shjg,
            "comment": shyj
        }),
        success: function (response) {
            if (response.errorCode == 200) {
                toastr.success("审核成功");
                setTimeout(function () {
                    window.location = "./blank2.html?id=" + id + "&type=approve";
                });
            }
        }
    });
}

$("#logoutModal").children(".btn").removeAttr("disabled");