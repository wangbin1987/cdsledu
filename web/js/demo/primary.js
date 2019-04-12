// Call the dataTables jQuery plugin
$(document).ready(function () {

    addChieseAsc();

    let role = getUserInfo().role;

    $('#dataTable').DataTable({
        language: {
            "sProcessing": "处理中...",
            "sLengthMenu": "显示 _MENU_ 项结果",
            "sZeroRecords": "没有匹配结果",
            "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
            "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
            "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
            "sInfoPostFix": "",
            "sSearch": "搜索:",
            "sUrl": "",
            "sEmptyTable": "表中数据为空",
            "sLoadingRecords": "正在加载数据...",
            "sInfoThousands": ",",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": "上一页",
                "sNext": "下一页",
                "sLast": "尾页"
            },
            "oAria": {
                "sSortAscending": ": 以升序排列此列",
                "sSortDescending": ": 以降序排列此列"
            }
        },
        "serverSide": false,
        ajax: {
            url: window.config.api + '/primary/enrolPlan',
            type: 'GET'
        },
        "columns": [
            {"data": "code"},
            {"data": "name"},
            {"data": "type"},
            {"data": "district"},
            {"data": "extra.septemberAdd"},
            {"data": "extra.left"}
        ], "columnDefs": [{
            // 定义操作列,######以下是重点########
            "targets": 6,//操作按钮目标列
            "data": null,
            "render": function (data, type, row) {
                let html = "<a href='javascript:void(0);' onclick='register(" + row.id + ")' class='view btn btn-default btn-xs'  ><i class='fa fa-check-square '></i> 报名</a>";
                if (role == '系统管理员') {
                    html += "<a href='javascript:void(0);' onclick='edit(" + row.id + ")' class='view btn btn-default btn-xs'  ><i class='fa fa-edit '></i> 修改</a>";
                }
                return html;
            }
        }],
    });
});

function register(id) {
    window.location = "./blank.html?schoolId=" + id;
}

function edit(id) {
    // alert(id);
    // 通过ajxa获取再显示数据
    $("#schoolId").val(id);
    // 加载住址所属社区数据联动
    $.ajax({
        url: window.config.api + '/primary/enrolPlan/' + id,
        method: "GET",
        success: function (response) {
            console.info(response);
            if (response.errorCode == 200) {
                $("#schoolCode").text(response.data.code);
                $("#schoolName").text(response.data.name);
                $("#schoolType").text(response.data.type);
                $("#totalStudent").val(response.data.extra.totalStudent);
                $("#currentStudent").val(response.data.extra.currentStudent);
                $("#juneGraduate").val(response.data.extra.juneGraduate);
                $("#plan").val(response.data.extra.septemberAdd);
                $("#currentSigned").text(response.data.extra.currentEnrollment);
                $("#myModal").modal("show");
            }
        }
    })
}

$("#updateBtn").click(function () {
    let id = $("#schoolId").val();
    let total = $("#totalStudent").val();
    let current = $("#currentStudent").val();
    let graduate = $("#juneGraduate").val();
    let plan = $("#plan").val();
    if (total.length == 0) {
        toastr.warning("请输入设计学位总数");
        return;
    }
    if (!(/(^[1-9]\d*$)/.test(total))) {
        toastr.warning("设计学位总数必须是正整数");
        return;
    }
    if (current.length == 0) {
        toastr.warning("请输入现有学生人数");
        return;
    }
    if (!(/(^[1-9]\d*$)/.test(current))) {
        toastr.warning("现有学生人数必须是正整数");
        return;
    }
    if (graduate.length == 0) {
        toastr.warning("请输入六月毕业学生人数");
        return;
    }
    if (!(/(^[1-9]\d*$)/.test(graduate))) {
        toastr.warning("六月毕业学生人数必须是正整数");
        return;
    }
    if (plan.length == 0) {
        toastr.warning("请输入计划招生人数");
        return;
    }
    if (!(/(^[1-9]\d*$)/.test(plan))) {
        toastr.warning("计划招生人数必须是正整数");
        return;
    }

    $.ajax({
        url: window.config.api + '/primary/enrolPlan',
        method: "POST",
        data: JSON.stringify({
            "id": id,
            "totalStudent": total,
            "currentStudent": current,
            "juneGraduate": graduate,
            "septemberAdd": plan
        }),
        success: function (response) {
            console.info(response);
            if (response.errorCode == 200) {
                toastr.success("操作成功");
                $("#myModal").modal("hide");
                $('#dataTable').DataTable().ajax.reload();
            }
        }
    })
})
