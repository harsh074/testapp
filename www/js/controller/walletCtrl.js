askmonkApp.controller('walletCtrl', ['$scope','utility','$state', function($scope,utility,$state){
	
	$scope.floatingBtnAction = false;
  $scope.$on('$ionicView.enter', function(){
    $scope.floatingBtnAction = true;
    $scope.showLoader();
  });

  $scope.askQuestion = function(){
    $scope.showLoader();
  	$state.go('app.askQuestion')
  }


	utility.getUserProfile()
	.then(function(data){
		$scope.userProfileData = data;
		$scope.hideLoader();
	},function(data){
		console.log(data);
		$scope.hideLoader();
	});

	utility.getPacks()
	.then(function(data){
		$scope.packs = data;
	},function(data){
		console.log(data);
	});
  
}]);
