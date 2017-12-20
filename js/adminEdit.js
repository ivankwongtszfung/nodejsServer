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
      var userData = response['data'];
      $('#username').text(userData.Username);
      $('#balance').text("Balance: "+userData.balance);
    },function error(response){
      localStorage.clear();
      console.log("abcdefg")
      $('#isLoginFalse').show();
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
  function getParameterByName(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
  var id = getParameterByName('id');
  $http.get("http://localhost:8888/item/selectItem?id="+id).then(function success(response){
    var data = response['data'].message[0];
    console.log(data)
    var tag = data['Tags'].join(" ");
    console.log(tag);
    data.Tags = tag;
    $scope.myData = data;
  },function error(response){
    $scope.name="";
    $('.alert').removeClass('hidden');
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
     var formData = $scope.myData;
     formData={
       "id":id,
       "title":formData.Title,
       "description":formData.Description,
       "available_quantity":formData.Available_quantity,
       "token_value":formData.Token_value,
       "image":"",
       "tags":""
     }
     var tags = $scope.myData.Tags.split(" ");
     formData.tags =tags;

     console.log(formData)
     var fd = new FormData();
     fd.append('logo',$('input#image')[0].files[0]);
     console.log(fd)
      $.ajax({
       method:'POST',
       url: "http://localhost:8888/upload/photoUpload",
       data: fd,
      processData: false,
      contentType: false,
      success: function(data){
        console.log(data.filename);
        formData.image = data.filename;
        $http({
          method:'POST',
          url: "http://localhost:8888/item/updateItem",
          data:$.param(formData),
          headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
        }).then(function success(response){
          alert("update Success")
          location.href = "http://localhost:8888/adminPanel";
        },function error(response){
          alert(response)
        });
      }
      });

  }


});

  

}]);
