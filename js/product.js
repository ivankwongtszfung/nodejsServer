var app = angular.module("myApp",[]);
var key=0;

app.controller('ctrl',['$scope','$http',function($scope,$http){

  $().ready(function(){
  //   function setCookie(cname, cvalue) {
  //       var d = new Date();
  //       d.setTime(d.getTime() + (24*60*60*1000));
  //       var expires = "expires="+ d.toUTCString();
  //       document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  //   }
  //   function getCookie(cname) {
  //     var name = cname + "=";
  //     var decodedCookie = decodeURIComponent(document.cookie);
  //     var ca = decodedCookie.split(';');
  //     for(var i = 0; i <ca.length; i++) {
  //         var c = ca[i];
  //         while (c.charAt(0) == ' ') {
  //             c = c.substring(1);
  //         }
  //         if (c.indexOf(name) == 0) {
  //             return c.substring(name.length, c.length);
  //         }
  //     }
  //     return "";
  // }
    $scope.submit = function() {
      $('.alert').addClass('hidden');
      $http({
        method:'GET',
        url:"/item/selectItem/",
        data:$.param($scope.input),
        headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
      }).then(function success(response){
        localStorage.setItem("token", response['data'].token);
        //console.log(localStorage.getItem("token"));
        location.href = "http://localhost:8888/";
      },function error(response){
        $scope.name="";
        console.log(response);
        $('#error').text(response.data.message);
        $('.alert').removeClass('hidden');
      });
     };

  });

}]);
