http://127.0.0.1:8888/item/listItem?sortCriteria=timestamp&ascending=true


var app = angular.module("myApp",['angularUtils.directives.dirPagination','ngMessages']);
var key=0;

app.controller('ctrl',['$scope','$http',function($scope,$http){
  $scope.currentPage = 1;
  $scope.pageSize = 10;
  $('#isLoginTrue').hide();
  $('#isLoginFalse').hide();
  $("#redeem").hide();
  $("#adminPanel").hide();
  if(localStorage.getItem("token")){
    console.log("123456789")
    req={
      method: 'GET',
      url: '/user/verifyToken',
      headers: {
        Authorization: 'Bearer ' +  localStorage.getItem("token")
      }
    };
    $http(req).then(function success(response){
      $('#isLoginTrue').show();
      $("#redeem").show();
      if(response['data'].Username=="ivan")
        $("#adminPanel").show();
      else{
        location.href="../";
      }
      var userData = response['data'];
      $('#username').text(userData.Username);
      $('#balance').text("Balance: "+userData.balance);
    });
  }
  else{
    console.log("abcdefg")
    $('#isLoginFalse').show();
  }

  $('#logout').click(function(){
    localStorage.clear();
    location.reload();
  });
  $http.get("/item/listItem?sortCriteria=timestamp&ascending=true").then(function success(response){
    console.log(response['data']);
    var itemData = response['data'];
    $scope.items=itemData.message;
  },function error(response){
    $scope.name="";
    $('.alert').removeClass('hidden');
  });
  function downloadCSV(args,data) {
        var data, filename, link;

        var csv = data;
        if (csv == null) return;

        filename = args.filename || 'export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }
  $('#CSVButton').click(function(){
    $http.get("http://localhost:8888/user/generateRedeemedCSV").then(function success(response){
      console.log(response);
      downloadCSV({ filename: "stock-data.csv" },response.data);
    },function error(response){
    });
  });
  $('#createButton').click(function(){
    location.href = "http://localhost:8888/adminPanel/create"
  });
  $scope.deleteClick = function(id){
      console.log(id);
      var data = {
        "id":id
      }
      if (!confirm('Are you sure ?')) {
          return;
      }


      $http({
        method:'POST',
        url:"/item/deleteItem/",
        data:$.param(data),
        headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
      }).then(function success(response){
          console.log(response);
          alert("remove success");
          location.reload();
        },function error(response){
          $scope.dataset="";
          $('.alert').removeClass('hidden');
        });
    }
  $("form#target").submit(function(e) {
   console.log(this);
   if($scope.myForm.$invalid){
     alert('data is invalid');
   }
   else{
      e.preventDefault();
     var formData = new FormData(this);
     var formData = $scope.myData;
     var tags = formData.tag.split(" ");
     formData.tags = [];
     formData.tags =tags;
     console.log(formData)
     var fd = new FormData();
     fd.append('logo',$('input#image')[0].files[0]);
      $.ajax({
       method:'POST',
       url: "http://localhost:8888/upload/photoUpload",
       data: fd,
      processData: false,
      contentType: false,
      success: function(data){
        console.log(data.filename);
        formData.Image = data.filename;
        $http({
          method:'POST',
          url: "http://localhost:8888/item/insertItem",
          data:$.param(formData),
          headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
        }).then(function success(response){
          location.href = "http://localhost:8888/adminPanel";
        },function error(response){
          alert(response)
        });
      }
      });

  }


});

}]);
