// Call the dataTables jQuery plugin
$(document).ready(function () {

  addChieseAsc();
  //添加中文排序
  function addChieseAsc() {
    jQuery.fn.dataTableExt.oSort['chinese-asc'] = function (x, y) {
      x = (x instanceof Array) ? x[0] : x == '-' ? 'z' : x; //z的ASCII码值最大
      y = (y instanceof Array) ? y[0] : y == '-' ? 'z' : y;
      //javascript自带的中文比较函数，具体用法可自行查阅了解
      return x.localeCompare(y);
    };

    jQuery.fn.dataTableExt.oSort['chinese-desc'] = function (x, y) {
      x = (x instanceof Array) ? x[0] : x == '-' ? 'z' : x;
      y = (y instanceof Array) ? y[0] : y == '-' ? 'z' : y;
      return y.localeCompare(x);
    };

    // aTypes是插件存放表格内容类型的数组
    // reg赋值的正则表达式，用来判断是否是中文字符
    // 返回值push到aTypes数组，排序时扫描该数组，'chinese'则调用上面两个方法。返回null默认是'string'
    jQuery.fn.dataTableExt.aTypes.push(function (sData) {
      var reg = /^[\u4e00-\u9fa5]{0,}$/;
      if (reg.test(sData)) {
        return 'chinese';
      }
      return null;
    });
  }

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
      { "data": "nickname" },
      { "data": "telephone" },
      { "data": "createTime" }
    ]
  });

});
