// Call the dataTables jQuery plugin
$(document).ready(function () {

    let role = getUserInfo().role;
    if (role == '街道办') {
        // $("#head").show();
    }

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
        "serverSide": false,
        ajax: {
            url: window.config.api + '/primary/getKindergarten',
            type: 'GET'
        },
        "aaSorting": [[2, "asc"]],
        "columns": [
            {"data": "studentName"},
            {"data": "studentIdentityNumber"},
            {"data": "createTime"},
            {"data": "schoolType"},
            {"data": "schoolName"},
            {"data": "showStatus"}
        ], "columnDefs": [
            // {
            //     // 定义操作列,######以下是重点########
            //     "targets": 4,//操作按钮目标列
            //     "className": 'class-center',
            //     "data": null,
            //     "render": function (data, type, row) {
            //         return row.rentAddressZone;
            //     }
            // },
            {
                // 定义操作列,######以下是重点########
                "targets": 6,//操作按钮目标列
                "className": 'class-center',
                "data": null,
                "render": function (data, type, row) {
                    let id = row.id;

                    if (row.operation == 1) {
                        let html = "<a href='javascript:void(0);' onclick='view(" + id + ")' class='view btn btn-default btn-xs'><i class='fa fa-file-alt'></i> 查看</a>";
                        html += "<a href='javascript:void(0);' onclick='edit(" + id + ")' class='view btn btn-default btn-xs'><i class='fa fa-edit'></i> 编辑</a>";
                        if (row.creatorId == getUserInfo().id) {
                            html += "<a href='javascript:void(0);' onclick='del(" + id + ")' class='down btn btn-default btn-xs'><i class='fa fa-trash-alt'></i> 删除</a>"
                        }
                        return html;
                    } else {
                        let html = "<a href='javascript:void(0);' onclick='view(" + id + ")' class='view btn btn-default btn-xs'><i class='fa fa-file-alt'></i> 查看</a>";
                        if (role == '公办幼儿园' || role == '公益幼儿园' || role == '学前科') {
                            html += "<a href='javascript:void(0);' onclick='approve(" + id + ")' class='down btn btn-default btn-xs'><i class='fa fa-sitemap'></i> 审核</a>"
                        }
                        return html;
                    }

                },
                "bSortable": false
            }],
    });
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