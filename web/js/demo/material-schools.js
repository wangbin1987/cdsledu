// Call the dataTables jQuery plugin
$(document).ready(function () {

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
        "bStateSave": true,//保存状态 进入详情后回退仍然在之前页码
        "serverSide": true,//服务器端获取数据
        ajax: {
            url: window.config.api + '/material/getApproveSchool',
            type: 'POST',
            data: function (data) {
                data.approveStatus = $("#approveStatus").val();
                return JSON.stringify(data)
            },
            error: function (xhr) {
                toastr.warning(xhr.responseJSON.message);
            },
            "dataFilter": function (json) { // json是服务器端返回的数据
                json = JSON.parse(json);
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
            {"data": "schoolName"},
            {"data": "schoolCode"},
            {"data": "submitTime"},
            {"data": "showStatus"}
        ], "columnDefs": [
            {
                "targets": 0,//操作按钮目标列
                "bSortable": false
            },
            {
                "targets": 3,//操作按钮目标列
                "bSortable": false
            },
            {
                // 定义操作列,######以下是重点########
                "targets": 4,//操作按钮目标列
                "className": 'class-center',
                "data": null,
                "render": function (data, type, row) {
                   let id = row.id;
                    let html = "";
                    row.operations.forEach(key => {
                        if (key == 'print') {
                            html += "<a href='javascript:void(0);' onclick='printIt(" + row.schoolCode + ")' class='view btn btn-default btn-xs'><i class='fa fa-print'></i> 打印</a>";
                        }
                        if (key == 'view') {
                            html += "<a href='javascript:void(0);' onclick='approve(" + row.schoolCode + ")' class='view btn btn-default btn-xs'><i class='fa fa-file-alt'></i> 查看</a>";
                        }
                        if (key == 'edit') {
                            html += "<a href='javascript:void(0);' onclick='edit(" + row.schoolCode + ")' class='view btn btn-default btn-xs'><i class='fa fa-edit'></i> 编辑</a>";
                        }
                        if (key == 'delete') {
                            html += "<a href='javascript:void(0);' onclick='del(" + row.schoolCode + ")' class='down btn btn-default btn-xs'><i class='fa fa-trash-alt'></i> 删除</a>"
                        }
                        if (key == 'approve') {
                            html += "<a href='javascript:void(0);' onclick='approve(" + row.schoolCode + ")' class='down btn btn-default btn-xs'><i class='fa fa-sitemap'></i> 审核</a>"
                        }
                    })
                    return html;
                },
                "bSortable": false
            }]
    });

});

function approve(id) {
    window.location = "./school-files.html?schoolCode=" + id;
}

$("#approveStatus").change(function () {
    $('#dataTable').DataTable().ajax.reload();
})

