askmonkApp.controller('walletCtrl', ['$scope','utility','$state', function($scope,utility,$state){
	
	$scope.floatingBtnAction = false;
  $scope.$on('$ionicView.enter', function(){
    $scope.floatingBtnAction = true;
    $scope.showLoader();
  });

  $scope.askQuestion = function(){
    $scope.showLoader();
  	$state.go('app.askQuestion');
  	window.plugins.nativepagetransitions.slide(
		  {"direction":"left"},
		  function (msg) {console.log("success: " + msg)}, // called when the animation has finished
		  function (msg) {alert("error: " + msg)} // called in case you pass in weird values
		);
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
