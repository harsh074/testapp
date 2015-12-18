askmonkApp.controller('yProfileCtrl', ['$scope','$state','$stateParams','utility', function($scope,$state,$stateParams,utility){
	if($stateParams.id){

		utility.getSingleMonk($stateParams.id)
		.then(function(data){
			$scope.hideLoader();
			$scope.monkProfileData = data;
		},function(data){
			console.log(data);
			$scope.hideLoader();
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
	}else{
		$state.go('app.yprofiles');
		window.plugins.nativepagetransitions.slide(
		  {"direction":"left"},
		  function (msg) {console.log("success: " + msg)}, // called when the animation has finished
		  function (msg) {alert("error: " + msg)} // called in case you pass in weird values
		);
	}
}]);