askmonkApp.controller('yProfilesCtrl', ['$scope','$state','utility','$stateParams','CONSTANT','$timeout', function($scope,$state,utility,$stateParams,CONSTANT,$timeout){

  // $scope.floatingBtnAction = false;
  $scope.$on('$ionicView.enter', function(){
    // $scope.floatingBtnAction = true;
    $scope.showLoader();
  });
  $scope.loginType = CONSTANT.loginType;
  $scope.showFilterMenu = false;

  $scope.sortedFilterValue = true;
  $scope.sortedFilter = 'rating';

  // if(localStorage.getItem('monksProfiles')){
  //   $scope.monksProfiles = JSON.parse(localStorage.getItem('monksProfiles'));
  //   $timeout(function(){
  //     $scope.hideLoader();    
  //   }, 100);
  // }else{
  	utility.getAllMonks()
  	.then(function(data){
      localStorage.setItem('monksProfiles',JSON.stringify(data));
  		$scope.monksProfiles = data;
  		$scope.hideLoader();
  	},function(data){
      if(data.error.statusCode == 422){
        $scope.showMessage(data.error.message);
      }
  		console.log(data,"error");
  	});
  // }

  $scope.goToYogiProfile = function(id){
  	$stateParams.id = id;
  	$state.go('app.yprofile',$stateParams);
    $scope.transitionAnimation('left',500);
  }

  $scope.askQuestion = function(){
  	$state.go('app.askQuestion');
    $scope.transitionAnimation('left',180);
  }

  $scope.showFilter = function(){
    $scope.showFilterMenu = true;
  }
  $scope.closeFilterMenu = function(){
    $scope.showFilterMenu = false;
  }

  $scope.sortFilter = function(value){
    if(value=="name"){
      $scope.sortedFilterValue = ($scope.sortedFilter === value) ? !$scope.sortedFilterValue : false;
    }else{
      $scope.sortedFilterValue = ($scope.sortedFilter === value) ? !$scope.sortedFilterValue : true;
    }
    $scope.sortedFilter = value;
    $scope.showFilterMenu = false;
  }
}]);