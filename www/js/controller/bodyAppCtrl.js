askmonkApp.controller('appCtrl', ['$scope','CONSTANT','$rootScope', function($scope,CONSTANT,$rootScope){
	$scope.isComingFromSignUp = CONSTANT.isComingFromSignUp;
	$scope.$on("updateEditProfileFirstUser", function() {
		$scope.isComingFromSignUp = CONSTANT.isComingFromSignUp;
		if(CONSTANT.isComingFromSignUp){
			$scope.showMessage('Please fill details to move further');
		}
 	});
}]);

askmonkApp.controller('bodyCtrl', ['$scope','utility','CONSTANT','$rootScope','CONSTANT', function($scope,utility,CONSTANT,$rootScope,CONSTANT){
	document.addEventListener("deviceready", onDeviceReady, false);
  function onDeviceReady() {
  	console.log('deviceReady');
  }
	
	utility.initialize(CONSTANT.baseUrl, false, $scope, $rootScope);
	$scope.showMessage = function(errorMessage) {
    window.plugins.toast.showWithOptions(
      {
        message: errorMessage,
        duration: "long",
        position: "bottom",
        addPixelsY: -20  // added a negative value to move it up a bit (default 0)
      },
      function(){
        console.log('sucess');
      }, // optional
      function(){
        console.log('error');
      }    // optional
    );
  }

}]);