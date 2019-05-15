// Call the dataTables jQuery plugin
$(document).ready(function () {

    // 下载url
    let download = "";

    let role = getUserInfo().role;
    if (role == '街道办') {
        // $("#head").show();
    }

    // 加载住址所属社区数据联动
    $.ajax({
        url: window.config.api + '/system/getDistrict',
        method: "GET",
        async: false,
        success: function (response) {
            for (let i = 0; i < response.data.length; i++) {
                $("#town").append($("<option data-value=" + response.data[i].name + "></option>").val(i + 1).html(response.data[i].name));
            }
        }
    })

    // 查看历史查询参数
    let searchHistory = localStorage.getItem("compulsorySearch");
    if (!isEmpty(searchHistory)) {
        searchHistory = JSON.parse(searchHistory);
        $("#approveStatus").val(searchHistory.approveStatus);
        $("#readType").val(searchHistory.readType);
        let townName = searchHistory.town;
        console.info("历史街道办：" + townName);
        if (!isEmpty(townName)) {
            $("#town option").each(function () {
                let val = $(this).val();
                let text = $(this).attr('data-value');
                console.info(text);
                if (text == townName) {
                    $("#town").val(val);
                }
            })
        }
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
        "serverSide": true,//服务器端获取数据
        // "ordering": false, // 禁止排序
        ajax: {
            url: window.config.api + '/enrollment/getCompulsory',
            method: 'POST',
            data: function (data) {
                data.approveStatus = $("#approveStatus").val();
                data.readType = $("#readType").val();
                data.town = $("#town").find("option:selected").data("value");
                // 把当前查询条件存起来方便回退
                localStorage.setItem("compulsorySearch", JSON.stringify(data));
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
        "aaSorting": [[3, "asc"]],
        "columns": [
            {"data": "studentName"},
            {"data": "studentIdentityNumber"},
            {"data": "serialNumber"},
            {"data": "createTime"},
            {"data": "applyType"},
            // {"data": "rentAddressZone"},
            {"data": "showStatus"},
            {"data": "status"}
        ],
        "columnDefs": [
            {
                "targets": 0,//操作按钮目标列
                "bSortable": false
            },
            {
                // 定义操作列,######以下是重点########
                "targets": 6,//操作按钮目标列
                "className": 'class-center',
                "data": null,
                "render": function (data, type, row) {


                    let id = row.id;
                    let html = "";
                    row.operations.forEach(key => {
                        if (key == 'print') {
                            html += "<a href='javascript:void(0);' onclick='printIt(" + id + ")' class='view btn btn-default btn-xs'><i class='fa fa-print'></i> 打印</a>";
                        }
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

    $("#export").click(function () {
        window.open(window.config.api + "/enrollment/downloadCompulsory/" + download + "?ACCESS-TOKEN=" + localStorage.getItem(window.config.token), "_blank");
    })
});

function printIt(id) {
    window.open("./print-confirm.html?id=" + id);
}

function view(id) {
    window.location = "./blank2.html?id=" + id + "&type=view";
}

function edit(id) {
    window.location = "./blank2.html?id=" + id + "&type=edit";
}

function approve(id) {
    window.location = "./blank2.html?id=" + id + "&type=approve";
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
        url: window.config.api + '/enrollment/deleteCompulsoryById/' + id,
        method: "POST",
        success: function (response) {
            if (response.errorCode == 200) {
                toastr.success("删除成功");
                $('#dataTable').DataTable().ajax.reload();
            }
        }
    });
}

$("#approveStatus,#readType,#town").change(function () {
    $('#dataTable').DataTable().ajax.reload();
})

