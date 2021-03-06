

var app = angular.module("myApp",[]);
var key=0;

app.controller('ctrl',['$scope','$http',function($scope,$http){
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

  $http.post("/getData").then(function success(response){
    console.log(response['data']['data']);
    $scope.name=response['data']['data'];
  },function error(response){
    $scope.name="";
    $('.alert').removeClass('hidden');
  });
  $scope.textSearch='';
  $scope.salary=[];
  $scope.salary[0]=0;
  $scope.salary[1]=100000;
  $scope.workHour=[];
  $scope.workHour[0]=0;
  $scope.workHour[1]=24;

  function formatData(key){
    var data=$scope.filteredItems[key];
    var worktime=data.worktime;
    start=parseInt(worktime[0].split(':')[0]);
    end=parseInt(worktime[1].split(':')[0]);
    data.workhour=end-start;
    return data;

  }

  $scope.search = function(value) {
    var worktime=value['worktime'];
    var start=worktime[0];
    var end=worktime[1];
    start=parseInt(start.split(':')[0]);
    end=parseInt(end.split(':')[0]);
    worktime=end-start;
    return (value['company']['name'].toLowerCase().indexOf($scope.textSearch.toLowerCase()) >= 0
            || value['title'].toLowerCase().indexOf($scope.textSearch.toLowerCase()) >= 0)
            && value['salary']>=$scope.salary[0] && value['salary']<=$scope.salary[1]
            && worktime>=$scope.workHour[0] && worktime<=$scope.workHour[1];

  };
  $scope.test=[];
  $scope.inspect = function(ai) {
    key=$(this)[0].key;
    console.log(key);
    data=formatData(key);
    $('.clicked').toggleClass('clicked');
    $('.data_'+key).toggleClass('clicked');
    $scope.jobSelect=data;
    $('.search-panel').addClass('hidden');
    $('.result-panel').removeClass('hidden');

  };
  $(function(){
    $('.close').click(function(){
      $('.search-panel').removeClass('hidden');
      $('.result-panel').addClass('hidden');
    });
    $('.right').click(function(){
      $('.clicked').toggleClass('clicked');
      if($scope.filteredItems.length==key+1){
        key=0;
        $('.data_'+key).toggleClass('clicked');
        $scope.jobSelect=formatData(0);
      }
      else{
        key+=1;
        $('.data_'+key).toggleClass('clicked');
        $scope.jobSelect=formatData(key);
      }
    });
    $('.left').click(function(){
      $('.clicked').toggleClass('clicked');
      if(key==0){
        key=$scope.filteredItems.length-1;
        $('.data_'+key).toggleClass('clicked');
        $scope.jobSelect=formatData(0);
      }
      else{
        key-=1;
        $('.data_'+key).toggleClass('clicked');
        $scope.jobSelect=formatData(key);
      }
    });
  });

  $http.get("/item/listItem?sortCriteria=timestamp&ascending=true").then(function success(response){
    console.log(response['data']);
    var itemData = response['data'];
    $scope.items=itemData.message;
  },function error(response){
    $scope.name="";
    $('.alert').removeClass('hidden');
  });




  // $scope.next = function() {
  //   console.log(this);
  //   if($scope.filteredItems.length==key+1){
  //     key=0;
  //     $scope.jobSelect=$scope.filteredItems[0];
  //   }
  //   else{
  //     key+=1;
  //     $scope.jobSelect=$scope.filteredItems[key];
  //   }
  // };
  // $scope.prev = function() {
  //   console.log(this);
  //   if(key==0){
  //     key=6;
  //     $scope.jobSelect=$scope.filteredItems[0];
  //   }
  //   else{
  //     key-=1;
  //     $scope.jobSelect=$scope.filteredItems[key];
  //   }
  // };
}]);

app.directive('slider', function() {
    return {
        restrict: 'AE',
        link: function(scope, element, attrs) {
            element.slider({
              range: true,
              min: parseInt(attrs.min),
              max: parseInt(attrs.max),
              values: [ 0, parseInt(attrs.max) ],
              slide: function( event, ui ) {
                scope.$apply(function() {
                     scope[attrs.ngModel] = ui.values;
                 });
              }
            });
        }
    };
});
