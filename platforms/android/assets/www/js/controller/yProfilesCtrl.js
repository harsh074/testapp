askmonkApp.controller('yProfilesCtrl', ['$scope','$state','utility','$stateParams','CONSTANT','$timeout', function($scope,$state,utility,$stateParams,CONSTANT,$timeout){

  // $scope.floatingBtnAction = false;
  $scope.$on('$ionicView.beforeEnter', function(){
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
      $scope.hideLoader();
      if(data && data.error.statusCode == 422){
        $scope.showMessage(data.error.message);
      }else{
        $scope.showMessage("Something went wrong. Please try again.");
      }
  		console.log(data,"error");
  	});
  // }

  $scope.goToYogiProfile = function(id){
  	$stateParams.id = id;
  	$state.go('app.yprofile',$stateParams);
  }

  $scope.askQuestion = function(){
  	$state.go('app.askQuestion');
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