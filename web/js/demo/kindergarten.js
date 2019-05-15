// Call the dataTables jQuery plugin
$(document).ready(function () {

    initDistrictSchool();

    // 初始化地区-学校信息，用于联动
    function initDistrictSchool() {
        $.ajax({
            url: window.config.api + '/system/getDistrictWithSchool',
            async: false,
            success: function (response) {
                for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i].kindergartens) {
                        let group = $("<optgroup label=" + response.data[i].name + "></optgroup>")
                        response.data[i].kindergartens.forEach(school => {
                            // if (school.type == '公办幼儿园') {
                            group.append($("<option data-value=" + school.code + "></option>").html(school.name));
                            // }
                        })
                        $("#school").append(group);
                    }
                }
            }
        })
    }


    let role = getUserInfo().role;
    if (!isEmpty(role)) {
        console.info(role.indexOf('幼儿园'));
        if (role == '系统管理员' || role == '学前科' || role.indexOf('幼儿园') != -1) {
            $("#searchHead").show();
            if (role.indexOf('幼儿园') != -1) {
                $(".admin").hide();
            }
        }
    }

    let download = "";
    addChieseAsc();

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
        "serverSide": true,//服务器端获取数据
        ajax: {
            url: window.config.api + '/primary/getKindergarten',
            type: 'POST',
            data: function (data) {
                data.approveStatus = $("#approveStatus").val();
                data.readType = $("#schoolType").val();
                data.town = $("#school").find("option:selected").data("value");
                return JSON.stringify(data)
            },
            error: function (xhr) {
                toastr.warning(xhr.responseJSON.message);
            },
            "dataFilter": function (json) { // json是服务器端返回的数据
                json = JSON.parse(json);
                download = json.data.download;
                let returnData = {};
                returnData.draw = json.data.draw;
                returnData.recordsTotal = json.data.total;// 返回数据全部记录
                returnData.recordsFiltered = json.data.total;// 后台不实现过滤功能，每次查询均视作全部结果
                returnData.data = json.data.list;// 返回的数据列表
                return JSON.stringify(returnData);// 这几个参数都是datatable需要的，必须要
            }
        },
        "aaSorting": [[2, "asc"]],
        "columns": [
            {"data": "studentName"},
            {"data": "studentIdentityNumber"},
            {"data": "createTime"},
            {"data": "serialNumber"},
            {"data": "schoolType"},
            {"data": "schoolName"},
            {"data": "showStatus"}
        ], "columnDefs": [
            {
                "targets": 0,//操作按钮目标列
                "bSortable": false
            },
            {
                // 定义操作列,######以下是重点########
                "targets": 7,//操作按钮目标列
                "className": 'class-center',
                "data": null,
                "render": function (data, type, row) {
                    let id = row.id;
                    let html = "";
                    row.operations.forEach(key => {
                        if (key == 'view') {
                            html += "<a href='javascript:void(0);' onclick='view(" + id + ")' class='view btn btn-default btn-xs'><i class='fa fa-file-alt'></i> 查看</a>";
                        }
                        if (key == 'edit') {
                            html += "<a href='javascript:void(0);' onclick='edit(" + id + ")' class='view btn btn-default btn-xs'><i class='fa fa-edit'></i> 编辑</a>";
                        }
                        if (key == 'delete') {
                            html += "<a href='javascript:void(0);' onclick='del(" + id + ")' class='down btn btn-default btn-xs'><i class='fa fa-trash-alt'></i> 删除</a>"
                        }
                        if (key == 'approve') {
                            html += "<a href='javascript:void(0);' onclick='approve(" + id + ")' class='down btn btn-default btn-xs'><i class='fa fa-sitemap'></i> 审核</a>"
                        }
                    })
                    return html;
                },
                "bSortable": false
            }],
    });

    $("#approveStatus,#schoolType,#school").change(function () {
        $('#dataTable').DataTable().ajax.reload();
    })

    $("#export").click(function () {
        window.open(window.config.api + "/primary/downloadKindergarten/" + download + "?ACCESS-TOKEN=" + localStorage.getItem(window.config.token), "_blank");
    })
});


function view(id) {
    window.location = "./blank.html?id=" + id + "&type=view";
}

function edit(id) {
    window.location = "./blank.html?id=" + id + "&type=edit";
}

function approve(id) {
    window.location = "./blank.html?id=" + id + "&type=approve";
}

function del(id) {
    $("#deleteBtn").attr('dir', id);
    $("#deleteInput").val('');
    $('#deleteModal').modal('show');

}

$(document).on("click", "#deleteBtn", function () {
    let id = $('#deleteBtn').attr('dir');
    if ($("#deleteInput").val().trim() == '删除') {
        $('#deleteModal').modal('hide');
        deleteData(id);
    }
});

function deleteData(id) {
    $.ajax({
        url: window.config.api + '/primary/deleteKindergarten/' + id,
        method: "POST",
        success: function (response) {
            if (response.errorCode == 200) {
                toastr.success("删除成功");
                $('#dataTable').DataTable().ajax.reload();
            }
        }
    });
}