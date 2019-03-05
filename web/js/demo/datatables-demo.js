// Call the dataTables jQuery plugin
$(document).ready(function() {

  $('#dataTable').DataTable();

  var tbody = $("#dataTable>tbody");
  tbody.empty();
  getAllUser();

  function getAllUser() {
    $.ajax({
        url: window.config.api + '/user/getAllUser',
        method: "GET",
        success: function (response) {
            console.table(response.data);
            response.data.forEach(user=>{
              var tr = $('<tr><th>'+user.department.name+'</th><th>'+user.username+'</th><th>'+user.nickname+'</th><th>'+user.telephone+'</th><th>'+user.createTime+'</th></tr>');
              tbody.append(tr);
            })
            
        }
    });
}
});
