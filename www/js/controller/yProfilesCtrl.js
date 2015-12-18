askmonkApp.controller('yProfilesCtrl', ['$scope','$state','utility','$stateParams', function($scope,$state,utility,$stateParams){
  
  $scope.showLoader();
	utility.getAllMonks()
	.then(function(data){
		$scope.monksProfiles = data;
		$scope.hideLoader();
	},function(data){
		console.log(data,"error");
	});

  $scope.goToYogiProfile = function(id){
  	$scope.showLoader();
  	$stateParams.id = id;
  	$state.go('app.yprofile',$stateParams);
  	window.plugins.nativepagetransitions.slide(
		  {"direction":"left"},
		  function (msg) {console.log("success: " + msg)}, // called when the animation has finished
		  function (msg) {alert("error: " + msg)} // called in case you pass in weird values
		);
  }

  $scope.floatingBtnAction = false;
	$scope.$on('$ionicView.enter', function(){
    $scope.floatingBtnAction = true;
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
}]);