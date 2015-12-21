askmonkApp.controller('walletCtrl', ['$scope','utility','$state','CONSTANT', function($scope,utility,$state,CONSTANT){
	
	$scope.floatingBtnAction = false;
  $scope.$on('$ionicView.enter', function(){
    $scope.floatingBtnAction = true;
    $scope.showLoader();
  });
  $scope.loginType = CONSTANT.loginType;

  $scope.askQuestion = function(){
  	$state.go('app.askQuestion');
		$scope.transitionAnimation('left',180);
  }

  if($scope.loginType == 'user'){
		utility.getUserProfile()
		.then(function(data){
			$scope.userProfileData = data;
			$scope.hideLoader();
		},function(data){
			console.log(data);
			$scope.hideLoader();
		});
	}else{
		utility.getMonkProfile()
		.then(function(data){
			$scope.userProfileData = data;
			$scope.hideLoader();
		},function(data){
			console.log(data);
			$scope.hideLoader();
		});
	}

	utility.getPacks()
	.then(function(data){
		$scope.packs = data;
	},function(data){
		console.log(data);
	});
  
}]);
