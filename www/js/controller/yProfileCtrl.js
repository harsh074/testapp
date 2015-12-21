askmonkApp.controller('yProfileCtrl', ['$scope','$state','$stateParams','utility', function($scope,$state,$stateParams,utility){
	if($stateParams.id){

		$scope.$on('$ionicView.enter', function(){
    	$scope.showLoader();
  	});

		utility.getSingleMonk($stateParams.id)
		.then(function(data){
			$scope.hideLoader();
			$scope.monkProfileData = data;
		},function(data){
			console.log(data);
			$scope.hideLoader();
		});

		$scope.askQuestion = function(){
	  	$state.go('app.askQuestion');
    	$scope.transitionAnimation('left',180);
	  }
	}else{
		$state.go('app.yprofiles');
  	$scope.transitionAnimation('left',180);
	}
}]);