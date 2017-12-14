var app = angular.module("myApp",[]);
var key=0;

app.controller('ctrl',['$scope','$http','$location',function($scope,$http,$location){
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
    var id = getParameterByName('id');
    console.log(id);
    $http({
      method:'GET',
      url:"/item/selectItem?id="+id,
      headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
    }).then(function success(response){
      console.log(response['data'].message);
      $scope.items=response['data'].message;
    },function error(response){
      $scope.name="";
      console.log(response);
      $('#error').text(response.data.message);
      $('.alert').removeClass('hidden');
    });
  });




}]);
