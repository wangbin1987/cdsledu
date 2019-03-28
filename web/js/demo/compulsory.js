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
        "serverSide": false,
        ajax: {
            url: window.config.api + '/enrollment/getCompulsory',
            type: 'GET'
        },
        "columns": [
            {"data": "guarderName"},
            {"data": "guarderIdentityNumber"},
            {"data": "studentName"},
            {"data": "studentIdentityNumber"},
            {"data": "rentAddressZone"},
            {"data": "showStatus"},
            {"data": "status"}
        ], "columnDefs": [{
            // 定义操作列,######以下是重点########
            "targets": 6,//操作按钮目标列
            "data": null,
            "render": function (data, type, row) {
                let id = row.id;

                let html = "<a href='javascript:void(0);' onclick='view(" + id + ")' class='view btn btn-default btn-xs'><i class='fa fa-file'></i> 查看</a>";
                html += "<a href='javascript:void(0);' onclick='edit(" + id + ")' class='view btn btn-default btn-xs'><i class='fa fa-edit'></i> 编辑</a>";
                html += "<a href='javascript:void(0);' onclick='approve(" + id + ")' class='view btn btn-default btn-xs'><i class='fa fa-list'></i> 审核</a>";
                html += "<a href='javascript:void(0);' onclick='alert(" + id + ")' class='down btn btn-default btn-xs'><i class='fa fa-times'></i> 删除</a>"
                return html;

            }
        }],
    });
});

function view(id) {
    window.location = "./blank2.html?id=" + id + "&view=1";
}

function edit(id) {
    window.location = "./blank2.html?id=" + id + "&edit=1";
}

function approve(id) {
    window.location = "./blank2.html?id=" + id + "&edit=1";
}