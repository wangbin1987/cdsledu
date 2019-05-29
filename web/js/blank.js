$(function () {
    // 省市区联动
    $("#disSelect").distpicker({
        autoSelect: true,
        placeholder: false
    })

    initDistrictSchool();

    // initGyKindergarten();

    // 初始化地区-学校信息，用于联动
    function initDistrictSchool() {
        $.ajax({
            url: window.config.api + '/system/getDistrictWithSchool',
            method: "GET",
            async: false,
            success: function (response) {
                for (let i = 0; i < response.data.length; i++) {
                    $("#district").append($("<option data-value=" + response.data[i].name + "></option>").val(i + 1).html(response.data[i].name));

                    // 公益不联动
                    // 公益幼儿园
                    // if (response.data[i].kindergartens) {
                    //     let group = $("<optgroup label=" + response.data[i].name + "></optgroup>")
                    //     response.data[i].kindergartens.forEach(school => {
                    //         if (school.type == '公益幼儿园') {
                    //             group.append($("<option data-value=" + school.code + "></option>").html(school.name));
                    //         }
                    //     })
                    //     $("#gySchool").append(group);
                    // }

                }
                // 为省份下拉列表绑定change事件
                $("#district").change(function () {
                    let index = $(this).val() - 1;// 获取当前省的下标
                    console.info(response.data[index]);

                    $("#gbSchool").prop("length", 1);// 清空原有的数据
                    if (response.data[index]) {
                        for (let i = 0; i < response.data[index].kindergartens.length; i++) {//重新为市赋值
                            if (response.data[index].kindergartens[i].type == '公办幼儿园') {
                                $("#gbSchool").append($("<option data-value=" + response.data[index].kindergartens[i].code + "></option>").val(i + 1).html(response.data[index].kindergartens[i].name));
                            }
                        }
                    }

                    $("#gySchool").prop("length", 1);// 清空原有的数据
                    if (response.data[index]) {
                        for (let i = 0; i < response.data[index].kindergartens.length; i++) {//重新为市赋值
                            if (response.data[index].kindergartens[i].type == '公益幼儿园') {
                                $("#gySchool").append($("<option data-value=" + response.data[index].kindergartens[i].code + "></option>").val(i + 1).html(response.data[index].kindergartens[i].name));
                            }
                        }
                    }
                });
            }
        })
    }

    function getSchoolInfo(schoolId) {
        $.ajax({
            url: window.config.api + '/primary/enrolPlan/' + schoolId,
            method: "GET",
            async: false,
            success: function (response) {
                console.info(response);
                if (response.errorCode == 200) {
                    if (response.data.district) {
                        let district = response.data.district;
                        $("#district option").each(function () {
                            let val = $(this).val();
                            let text = $(this).attr('data-value');
                            // console.info(text);
                            if (text == district) {
                                $("#district").val(val);
                            }
                        })
                        $("#district").trigger("change");
                    }
                    if (response.data.code) {
                        let school = response.data.code;
                        $("#gbSchool option").each(function () {
                            let val = $(this).val();
                            let text = $(this).attr('data-value');
                            // console.info(text);
                            if (text == school) {
                                $("#gbSchool").val(val);
                            }
                        })
                        $("#gySchool option").each(function () {
                            let val = $(this).val();
                            let text = $(this).attr('data-value');
                            if (text == school) {
                                console.info("school:" + school + " val:" + val + " text:" + text);
                                console.info("匹配到了")
                                $("#gySchool").val(val).trigger("change");
                            }
                        })
                        if (response.data.type == '公办幼儿园') {
                            // 是否公办可以报名
                            checkInitTime('gb');
                        }
                        if (response.data.type == '公益幼儿园') {
                            // 是否公益可以报名
                            checkInitTime('gy');
                        }
                    }
                }
            }
        })
    }

    function checkInitTime(type) {
        $.ajax({
            url: window.config.api + '/system/isKindergartenSign',
            method: "GET",
            async: false,
            success: function (response) {
                if (type == 'gb' && !response.data.gbKindergarten) {
                    toastr.warning("当前时间无法进行公办幼儿园报名");
                    $("#gbSchool").empty();
                }
                if (type == 'gy' && !response.data.gyKindergarten) {
                    toastr.warning("当前时间无法进行公益幼儿园报名");
                    $("#gySchool").empty();
                }
            }
        })
    }

    // 援藏干部
    $("input[type=radio][name=hjgs]").change(function () {
        // 援藏干部
        if (this.value === "yzgb") {
            $("#addressTitle").text('援藏干部房产地址');
        } else {
            $("#addressTitle").text('户籍地址');
        }
    });

    $("#qyn").trigger("click");

    let id = getUrlParam("id");
    if (isEmpty(id)) {
        // 自动带入监护人信息
        let user = getUserInfo();
        $("#guarder").val(user.nickname);
        $("#guarderId").val(user.idCardNumber);
        $("#telephone").val(user.telephone);
        // 是否通过招生计划页面进入，会带着schoolId
        let schoolId = getUrlParam("schoolId");
        if (!isEmpty(schoolId)) {
            getSchoolInfo(schoolId);
        }
        // 提交，保存并提交展示
        $("#submit").show();
        $("#submitApprove").show();
        $("#editTr").show();
        checkSignTime('add');
    } else {
        $.ajax({
            url: window.config.api + '/primary/getKindergarten/' + id,
            method: "GET",
            async: false,
            success: function (response) {
                $("#xsName").val(response.data.studentName);
                $("#xsName").attr('title', response.data.studentName);
                $("#xsId").val(response.data.studentIdentityNumber)
                $("#xsId").attr('title', response.data.studentIdentityNumber);

                if (response.data.studentGender == '男') {
                    $("input[name='xsGender'][value='male']").attr("checked", true);
                } else {
                    $("input[name='xsGender'][value='female']").attr("checked", true);
                }

                $("#guarder").val(response.data.guarderName);
                $("#guarder").attr('title', response.data.guarderName);
                $("#guarderId").val(response.data.guarderIdentityNumber)
                $("#guarderId").attr('title', response.data.guarderIdentityNumber);
                $("#telephone").val(response.data.telephone)
                $("#telephone").attr('title', response.data.telephone);

                // 省市区
                let addr = response.data.studentHousehold.split("|");
                $("#province").val(addr[0]);
                $("#province").trigger("change");
                $("#city").val(addr[1]);
                $("#city").trigger("change");
                $("#county").val(addr[2]);
                $("#county").trigger("change");

                if (response.data.residenceArea) {
                    let district = response.data.residenceArea;
                    $("#district option").each(function () {
                        let val = $(this).val();
                        let text = $(this).attr('data-value');
                        // console.info(text);
                        if (text == district) {
                            $("#district").val(val);
                        }
                    })
                    $("#district").trigger("change");
                }

                $("#address").val(response.data.address)
                $("#address").attr('title', response.data.address)

                if (response.data.gbKindergarten) {
                    let gbSchool = response.data.gbKindergarten;
                    $("#gbSchool option").each(function () {
                        let val = $(this).val();
                        let text = $(this).attr('data-value');
                        // console.info(text);
                        if (text == gbSchool) {
                            $("#gbSchool").val(val);
                        }
                    })
                    // 隐藏公益
                    $(".gy-school").css('display', 'none');
                }

                if (response.data.gyKindergarten) {
                    let gySchool = response.data.gyKindergarten;
                    $("#gySchool option").each(function () {
                        let val = $(this).val();
                        let text = $(this).attr('data-value');
                        // console.info("gySchool "+val);
                        if (text == gySchool) {
                            $("#gySchool").val(val).trigger("change");
                        }
                    })
                    // 隐藏公办
                    $(".gb-school").css('display', 'none');
                }

                if (response.data.householdType == '援藏干部') {
                    $("input[name='hjgs'][value='yzgb']").attr("checked", true);
                    $("#yzgb").trigger("change");
                } else {
                    $("input[name='hjgs'][value='qyn']").attr("checked", true);
                    $("#qyn").trigger("change");
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
                                username = his.department;
                            }
                        }
                        htmlStr = htmlStr + his.createTime + '&nbsp;&nbsp;' + username + ' ' + status + '<br>';
                    });
                    $("#editTr").before($("<tr><td>操作历史：</td><td colspan='5'>" + htmlStr + "</td></tr>"))
                }

                let type = getUrlParam("type");
                if (type == 'edit') {
                    $("#editTr").show();
                    if (response.data.canEdit) {
                        $(":input").removeAttr("disabled");
                        // 0 未提交，1 已提交（这种情况下是不同意）
                        if (response.data.status == 0) {
                            $("#submit").show();
                            $("#submitApprove").show();
                        } else {
                            $("#submit").hide();
                            $("#submitApprove").show();
                            $("#submitApprove").text(response.data.editBtn);
                        }
                    } else {
                        $("#submit").text(response.data.editBtn);
                        $("#submitApprove").text(response.data.editBtn);
                        setView();
                    }
                    checkSignTime('add');
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
        }) // 根据id填充表单
        checkSignTime('view');
    }


    $('#submit').on('click', function () {
        formValidate(0);
    });

    $('#submitApprove').on('click', function () {
        formValidate(1);
    });

    function formValidate(submit) {

        let studentName = $.trim($("#xsName").val());
        if (isEmpty(studentName)) {
            toastr.warning("请输入幼儿姓名");
            $("#xsName").focus();
            return;
        } else {
            if (!isChinaName(studentName)) {
                toastr.warning("幼儿姓名格式不正确");
                $("#xsName").focus();
                return;
            }
        }

        let studentIdentityNumber = $.trim($("#xsId").val());
        if (isEmpty(studentIdentityNumber)) {
            toastr.warning("请输入幼儿身份证");
            $("#xsId").focus();
            return;
        } else {
            if (!isCardNo(studentIdentityNumber)) {
                toastr.warning("幼儿身份证格式不正确");
                $("#xsId").focus();
                return;
            } else {
                // 3岁(8月31日以后的不能报名，不包含8月31)，4岁(8月31日之前的不能报名，包含8月31)
                let birth = studentIdentityNumber.substring(6, 14);
                console.info("birthday:" + birth);
                let end = (new Date().getFullYear() - 3) + "0831";
                let begin = (new Date().getFullYear() - 4) + "0831";
                if (birth > end) {
                    toastr.warning("幼儿园只接收" + (new Date().getFullYear() - 3) + "年8月31日之前出生的学生");
                    $("#xjh").focus();
                    return;
                }
                if (birth <= begin) {
                    toastr.warning("幼儿园不接收" + (new Date().getFullYear() - 4) + "年8月31日之前出生的学生");
                    $("#xjh").focus();
                    return;
                }
            }
        }

        let studentGender = $("input[type='radio'][name='xsGender']:checked").val();
        if (studentGender == 'male') {
            studentGender = '男'
        } else {
            studentGender = '女'
        }

        let guarderName = $.trim($("#guarder").val());
        if (isEmpty(guarderName)) {
            toastr.warning("请输入监护人姓名");
            $("#guarder").focus();
            return;
        } else {
            if (!isChinaName(guarderName)) {
                toastr.warning("监护人姓名格式不正确");
                $("#guarder").focus();
                return;
            }
        }

        let guarderIdentityNumber = $.trim($("#guarderId").val());
        if (isEmpty(guarderIdentityNumber)) {
            toastr.warning("请输入监护人身份证");
            $("#guarderId").focus();
            return;
        } else {
            if (!isCardNo(guarderIdentityNumber)) {
                toastr.warning("监护人身份证格式不正确");
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

        let district = $("#district").find("option:selected").data("value");
        let address = $.trim($("#address").val());
        // 户籍地址
        if (isEmpty(district)) {
            toastr.warning("请选择户籍地址所在街道/镇");
            $("#district").focus();
            return;
        }
        if (isEmpty(address)) {
            toastr.warning("请输入户籍详细地址");
            $("#address").focus();
            return;
        }

        // 公办幼儿园
        let gbSchool = $("#gbSchool").find("option:selected").data("value");

        // 公益幼儿园
        let gySchool = $("#gySchool").find("option:selected").data("value");

        if (isEmpty(gbSchool) && isEmpty(gySchool)) {
            toastr.warning("请选择幼儿园");
            return;
        }

        console.info("提交数据");

        // 户籍地址
        let studentHousehold = $("#province").val() + "|" + $("#city").val() + "|" + $("#county").val();


        let hjgs = $("input[type='radio'][name='hjgs']:checked").val();
        if (hjgs == 'yzgb') {
            hjgs = '援藏干部'
        } else {
            hjgs = '双流区'
        }

        console.info("id:" + id);
        console.info("学生姓名:" + studentName)
        console.info("学生身份证号:" + studentIdentityNumber)
        console.info("学生性别:" + studentGender)

        console.info("监护人姓名：" + guarderName)
        console.info("监护人身份证：" + guarderIdentityNumber)
        console.info("联系电话：" + telephone)

        console.info("户籍地址:" + studentHousehold)
        console.info("所在区域:" + district)
        console.info("详细地址:" + address)

        console.info("公办幼儿园:" + gbSchool)
        console.info("公益幼儿园:" + gySchool)
        console.info("户籍归属:" + hjgs)

        let param = {};
        param.id = id;
        param.submit = submit;
        param.studentName = studentName;
        param.studentIdentityNumber = studentIdentityNumber;
        param.studentGender = studentGender;
        param.guarderName = guarderName;
        param.guarderIdentityNumber = guarderIdentityNumber;
        param.telephone = telephone;
        param.studentHousehold = studentHousehold;
        param.residenceArea = district;
        param.address = address;
        param.gbKindergarten = gbSchool;
        param.gyKindergarten = gySchool;
        param.householdType = hjgs;


        if (param.submit == 0) {
            swal({
                title: "保存提示",
                text: "保存数据并不会提交到幼儿园，只是临时保存并未提交，如果要提交到幼儿园请点击保存并提交按钮"
            })
                .then((value) => {
                    saveData(param);
                });
        } else {
            swal({
                title: "提交确认",
                text: "数据提交后不可更改，除非幼儿园审核不通过，如果由于误操作提交了错误的数据，您可以在报名列表删除该提交记录并重新提交",
                buttons: {
                    cancel: "取消",
                    deleteIt: {
                        text: "确定提交",
                        value: "confirm"
                    }
                },
            })
                .then((value) => {
                    if (value == 'confirm') {
                        saveData(param);
                    }
                });
        }
    }

    function saveData(param) {
        $.ajax({
            url: window.config.api + '/primary/saveKindergarten',
            method: "POST",
            data: JSON.stringify(param),
            success: function (response) {
                if (response.errorCode == 200) {
                    if (isEmpty(param.id) || param.submit == 0) {
                        toastr.success("保存成功");
                        id = response.data;
                        setTimeout(function () {
                            window.location = "./kindergarten.html";
                        }, window.config.timeout);
                    } else {
                        if (!isEmpty(param.gbKindergarten)) {
                            alert("恭喜您报名成功！\n请于5月20到21日持幼儿户口簿原件及复印件到所选幼儿园进行现场资格确认。");
                        }
                        if (!isEmpty(param.gyKindergarten)) {
                            alert("恭喜您报名成功！\n请于6月10到11日持幼儿户口簿原件及复印件到所选幼儿园进行现场资格确认。");
                        }
                        window.location = "./kindergarten.html";
                    }
                }
            }
        });
    }

    $("#province,#city,#county").attr("disabled", "disabled")

    /**
     * 检查报名时间
     * @param type type为add表示新增或修改（需要在规定的时间内）
     */
    function checkSignTime(type) {
        // 获取公益公办幼儿园报名时间
        $.ajax({
            url: window.config.api + '/system/isKindergartenSign',
            method: "GET",
            async: false,
            success: function (response) {
                $("#message").html(response.data.gbMessage + "<br>" + response.data.gyMessage);
                $("#message").css('display', 'inline-block');

                if (type == 'add') {
                    if (!response.data.gbKindergarten && !response.data.gyKindergarten) {
                        toastr.warning("当前时间不在幼儿园报名时间内");
                        setView();
                    }
                    if (response.data.gbKindergarten) {
                        $(".gb-school").css('display', 'table-cell');
                        $(".gy-school").css('display', 'none');
                    }
                    if (response.data.gyKindergarten) {
                        $(".gy-school").css('display', 'table-cell');
                        $(".gb-school").css('display', 'none');
                    }
                    // 都不在，显示一个吧，显示公办
                    if (!response.data.gbKindergarten && !response.data.gyKindergarten) {
                        $(".gb-school").css('display', 'table-cell');
                    }
                } else {
                    // 公办幼儿园
                    let gbSchool = $("#gbSchool").find("option:selected").data("value");
                    // 公益幼儿园
                    let gySchool = $("#gySchool").find("option:selected").data("value");
                    if (!isEmpty(gbSchool)) {
                        $(".gb-school").css('display', 'table-cell');
                        $(".gy-school").css('display', 'none');
                    }
                    if (!isEmpty(gySchool)) {
                        $(".gy-school").css('display', 'table-cell');
                        $(".gb-school").css('display', 'none');
                    }
                }
            }
        })
    }

    // 学生身份证校验以及和性别联动
    $("#xsId").on('blur', function () {
        let idNumber = $.trim($("#xsId").val());
        if (isEmpty(idNumber)) {
            return;
        }
        if (!isCardNo(idNumber)) {
            toastr.warning("幼儿身份证格式不正确");
            $("#xsId").focus();
            return;
        }
        let gender = (parseInt(idNumber.substr(16, 1)) % 2 == 1);
        if (gender) {
            $("input[name='xsGender'][value='male']").trigger('click');
        } else {
            $("input[name='xsGender'][value='female']").trigger('click');
        }
    })

    $('#approveBtn').on('click', function () {
        if (!isEmpty(id)) {
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
            url: window.config.api + '/primary/approveKindergarten',
            method: "POST",
            data: JSON.stringify({
                "id": id,
                "status": approveResult,
                "comment": approveComment
            }),
            success: function (response) {
                if (response.errorCode == 200) {
                    toastr.success("审核成功，2秒后跳转审核列表");
                    setTimeout(function () {
                        window.location = "./kindergarten.html";
                    }, window.config.timeout);
                }
            }
        });
    }

    function setView() {
        $(":input").attr("disabled", "disabled");
        $("#logoutBtn").attr("disabled", false);
    }

    $("#submitApprove").css('width', '20%')

});