askmonkApp.controller('appCtrl', ['$scope','CONSTANT','$state', function($scope,CONSTANT,$state){
	$scope.isComingFromSignUp = CONSTANT.isComingFromSignUp;
	$scope.$on("updateEditProfileFirstUser", function() {
		$scope.isComingFromSignUp = CONSTANT.isComingFromSignUp;
		if(CONSTANT.isComingFromSignUp){
			$scope.showMessage('Please fill details to move further');
		}
 	});

 	$scope.sideMenuName = localStorage.getItem("name");
  $scope.$on("updateSideMenuName",function(evt,data){
    $scope.sideMenuName = localStorage.getItem("name");
  });
  $scope.goToWallet = function(){
    $state.go("app.wallet");
    window.plugins.nativepagetransitions.slide(
      {"direction":"left"},
      function (msg) {console.log("success: " + msg)}, // called when the animation has finished
      function (msg) {alert("error: " + msg)} // called in case you pass in weird values
    );
  };
}]);

askmonkApp.controller('bodyCtrl', ['$scope','utility','CONSTANT','$rootScope','CONSTANT','$ionicLoading','$timeout','$ionicHistory','$state','$ionicSideMenuDelegate', function($scope,utility,CONSTANT,$rootScope,CONSTANT,$ionicLoading,$timeout,$ionicHistory,$state,$ionicSideMenuDelegate){
	document.addEventListener("deviceready", onDeviceReady, false);
  $scope.showArrow = false;

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

  $scope.hamburgerBtnEvent = function(){
    if($state.current.name == 'app.editProfile' || $state.current.name == 'app.askQuestion' || $state.current.name == 'app.yprofile' || $state.current.name == 'app.singlequestion'){
      $timeout(function(){
        $ionicHistory.goBack();
        window.plugins.nativepagetransitions.slide(
          {"direction":"right"},
          function (msg) {console.log("success: " + msg)}, // called when the animation has finished
          function (msg) {alert("error: " + msg)} // called in case you pass in weird values
        );
      }, 300);
    }else{
      
      $ionicSideMenuDelegate.toggleLeft();
    }
  }
  $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
     if(toState.name == 'app.editProfile' || toState.name == 'app.askQuestion' || toState.name == 'app.yprofile' || toState.name == 'app.singlequestion'){
      $scope.showArrow = true;
    }else{
      $scope.showArrow = false;
    }
  });
}]);