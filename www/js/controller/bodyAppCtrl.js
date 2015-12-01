askmonkApp.controller('appCtrl', ['$scope','CONSTANT','$rootScope', function($scope,CONSTANT,$rootScope){
	$scope.isComingFromSignUp = CONSTANT.isComingFromSignUp;
	$scope.$on("updateEditProfileFirstUser", function() {
		$scope.isComingFromSignUp = CONSTANT.isComingFromSignUp;
		if(CONSTANT.isComingFromSignUp){
			$scope.showMessage('Please fill details to move further');
		}
 	});

 	$scope.sideMenuName = localStorage.getItem("name");
}]);

askmonkApp.controller('bodyCtrl', ['$scope','utility','CONSTANT','$rootScope','CONSTANT','$ionicLoading', function($scope,utility,CONSTANT,$rootScope,CONSTANT,$ionicLoading){
	document.addEventListener("deviceready", onDeviceReady, false);
  function onDeviceReady() {
  	console.log('deviceReady');
  }
	
	utility.initialize(CONSTANT.baseUrl, false, $scope, $rootScope);

	$scope.showMessage = function(message) {
    window.plugins.toast.showWithOptions({
      message: message,
      duration: "long",
      position: "bottom",
      addPixelsY: -20  // added a negative value to move it up a bit (default 0)
    },
    function(){
      console.log('sucess');
    }, // optional
    function(){
      console.log('error');
    }); // optional
  }
  $scope.showLoader = function(duration) {
    $ionicLoading.show({
      animation: 'fade-in',
      showBackdrop: true,
      template:'<ion-spinner icon="ripple" class="spinner-askmonk"></ion-spinner>'
    });
  };
  $scope.hideLoader = function(){
    $ionicLoading.hide();
    // function success (status) { };
    // function error (status) { };
    // if(ionic.Platform.isAndroid()){
      // window.cache.clear( success, error );
    // }
  };

}]);