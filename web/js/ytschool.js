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
    function img() {
        let file = document.getElementById("uploadimg").files; //获取input file的文件对象
        for (let i = 0; i < file.length; i++) { //多图,单图不用for
            let url = URL.createObjectURL(file[i]); //获取所选文件的临时地址
            $("#img").html('<img src="' + url + '" alt="" widht="25mm" height="35mm">'); //单图用html,多图用append
        }
    }

// 图片预览就是这么简单!

// files(file)//多图异步上传方法


// 多图异步上传
// function files(file){
// var file = Array.from(file);//将file文件转成数组类型
// var files = new FormData($("#files")[0]);//获取form对象
// for ( var i = 0; i < file.length; i++ ) {
// 	files.append( 'imgs[]',file[i]);//把文件属性存到数组
// 	// PHP后台用$_FILES['img']接收
// }
// $.ajax( {
// 			url: '123.php',//你的保存文件脚本的路径
// 			type: 'POST',
// 			data:files,
// 			contentType: false, //不设置内容类型
// 			processData: false, //不处理数据
// 			cache:"false",
// 			async:"true",
// 			dataType:"json",
// 			success: function (data) {
// 				alert('上传成功');
// 				console.log(data)
// 			},
// 			error: function () {
// 				alert('上传失败');
// 			}
// 		} )
// }