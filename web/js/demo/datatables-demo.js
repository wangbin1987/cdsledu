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
      url: window.config.api + '/user/getAllUser',
      type: 'GET'
    },
    "columns": [
      { "data": "department.name" },
      { "data": "username" },
      { "data": "password" },
      { "data": "nickname" },
      { "data": "telephone" },
      { "data": "createTime" }
    ]
  });

});
