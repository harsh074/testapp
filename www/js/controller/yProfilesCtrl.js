askmonkApp.controller('yProfilesCtrl', ['$scope','$state','utility','$stateParams','CONSTANT', function($scope,$state,utility,$stateParams,CONSTANT){

  $scope.floatingBtnAction = false;
  $scope.$on('$ionicView.enter', function(){
    $scope.floatingBtnAction = true;
    $scope.showLoader();
  });
  $scope.loginType = CONSTANT.loginType;

	utility.getAllMonks()
	.then(function(data){
		$scope.monksProfiles = data;
		$scope.hideLoader();
	},function(data){
		console.log(data,"error");
	});

  $scope.goToYogiProfile = function(id){
  	$stateParams.id = id;
  	$state.go('app.yprofile',$stateParams);
    $scope.transitionAnimation('left',180);
  }

  $scope.askQuestion = function(){
  	$state.go('app.askQuestion');
    $scope.transitionAnimation('left',180);
  }
}]);