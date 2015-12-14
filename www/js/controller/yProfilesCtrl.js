askmonkApp.controller('yProfilesCtrl', ['$scope','$state', function($scope,$state){
  $scope.goToYogiProfile = function(){
  	// $scope.showLoader();
  	$state.go('app.yprofile')
  }

  $scope.floatingBtnAction = false;
	$scope.$on('$ionicView.enter', function(){
    $scope.floatingBtnAction = true;
  });

  $scope.askQuestion = function(){
    $scope.showLoader();
  	$state.go('app.askQuestion');
  }
}]);