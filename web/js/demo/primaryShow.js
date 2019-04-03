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
            url: window.config.api + '/primary/enrolPlan',
            type: 'GET'
        },
        "columns": [
            {"data": "code"},
            {"data": "name"},
            {"data": "type"},
            {"data": "district"},
            {"data": "extra.septemberAdd"},
            {"data": "extra.currentEnrollment"},
            {"data": "extra.left"}
        ], "columnDefs": [{
            // 定义操作列,######以下是重点########
            "targets": 7,//操作按钮目标列
            "data": null,
            "render": function (data, type, row) {
                let html = "<a href='javascript:void(0);' onclick='edit(" + row.id + ")' class='view btn btn-default btn-xs'  ><i class='fa fa-check-square '></i> 报名</a>";
                return html;
            }
        }],
    });
});

function edit(id) {
    alert(id);
// 通过ajxa获取再显示数据
}

