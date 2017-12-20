var app = angular.module("myApp",[]);
var key=0;

app.controller('ctrl',['$scope','$http','$location','$sce',function($scope,$http,$location,$sce){
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
  $( document ).ready(function(){
    var formName;
    var id = getParameterByName('id');
    console.log(id);
    $http({
      method:'GET',
      url:"/item/selectItem?id="+id,
      headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
    }).then(function success(response){
      console.log(response['data'].message);
      $scope.items=response['data'].message;
	  $scope.trustedHtml = $sce.trustAsHtml(response['data'].message[0].Description);

    },function error(response){
      $scope.name="";
      console.log(response);
      $('#error').text(response.data.message);
      $('.alert').removeClass('hidden');
    });

    $scope.virtial=function(){
      var formData = {
        "id" : id,
        "username" : $("#username").text()
      };
      $http({
        method:'POST',
        url:"/item/redeemItem",
        data:$.param(formData),
        headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
      }).then(function success(response){
        alert("Redeeem Success");
      },function error(response){
        alert("Redeeem failed");
        console.log(response)
      });
    };


  });




}]);
