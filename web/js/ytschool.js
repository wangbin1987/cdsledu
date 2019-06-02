//打印页面
$(document).on("click", "#printBtn", function () {
    $("#printDiv").hide();
    window.print();
    $("#printDiv").show();
})

// 验证函数
function formValidate(submit) {

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

    let nations = $.trim($("#nation").val());
    if (isEmpty(nations)) {
        toastr.warning("请输入民族");
        $("#nation").focus();
        return;
    } else {
        if (!isChinaName(nations)) {
            toastr.warning("民族格式不正确");
            $("#nation").focus();
            return;
        }
    }

    let guarderName = $.trim($("#guarder").val());
    if (isEmpty(guarderName)) {
        toastr.warning("请输入家长姓名");
        $("#guarder").focus();
        return;
    } else {
        if (!isChinaName(guarderName)) {
            toastr.warning("家长姓名格式不正确");
            $("#guarder").focus();
            return;
        }
    }
    let telephone = $.trim($("#guarderTelephone").val());
    if (isEmpty(telephone)) {
        toastr.warning("请输入家长联系电话");
        $("#guarderTelephone").focus();
        return;
    } else {
        if (!isTelephone(telephone)) {
            toastr.warning("家长电话格式不正确");
            $("#guarderTelephone").focus();
            return;
        }
    }
    // 地址
    let address = $.trim($("#address").val());
    if (isEmpty(address)) {
        toastr.warning("请输入住址详细地址");
        $("#address").focus();
        return;
    }

    let grade = $("#major").val();
    if (isEmpty(major)) {
        toastr.warning("请选择申请专业");
        $("#major").focus();
        return;

        // 学籍号
        let studentSchoolRoll = $.trim($("#xjh").val());

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
                $("input[name='xsGender'][value='male']").trigger('click');
            } else {
                $("input[name='xsGender'][value='female']").trigger('click');
            }
        })
    }
}

// 请在该段js代码请引用jq,否则代码无效
$("#upload").change(function(e) {
    for (var i = 0; i < e.target.files.length; i++) {
        var file = e.target.files.item(i);
        var freader = new FileReader();
        freader.readAsDataURL(file);
        freader.onload = function(e) {
            var src = e.target.result;
            $("#imgUrl").attr("src",src);
        }
    }
});


