askmonkApp.controller('appCtrl', ['$scope','CONSTANT','$state','utility','$rootScope','$timeout', function($scope,CONSTANT,$state,utility,$rootScope,$timeout){
	$scope.isComingFromSignUp = CONSTANT.isComingFromSignUp;
  $scope.loginType = CONSTANT.loginType;
  
	$scope.$on("updateEditProfileFirstUser", function() {
		$scope.isComingFromSignUp = CONSTANT.isComingFromSignUp;
		if(CONSTANT.isComingFromSignUp){
			$scope.showMessage('Please fill details to move further');
		}
 	});

  $scope.$on("writeAnswerActive", function() {
    $scope.isComingFromSignUp = CONSTANT.isComingFromSignUp;
    if(CONSTANT.isComingFromSignUp){
      $scope.showMessage('Write your answer');
    }
  });

 	$scope.sideMenuName = localStorage.getItem("name");
  $scope.$on("updateSideMenuName",function(evt,data){
    $scope.loginType = CONSTANT.loginType;
    $scope.sideMenuName = localStorage.getItem("name");
  });
  $scope.goToWallet = function(){
    $state.go("app.wallet");
    $scope.transitionAnimation('left',160);
  };
  if($scope.loginType == 'monk'){
    $timeout(function(){
      utility.getMonkCount()
      .then(function(data){
        $scope.getMonkCount = data;
      },function(data){
        console.log(data);
      });
    }, 600);
  }
  
  $scope.changeAvaliableStatus = function(){
    $scope.profileData = JSON.parse(localStorage.profile);
    utility.updateMonkAvailableStatus({id:$scope.profileData.id,email:$scope.profileData.email,isAvailable:$scope.getMonkCount.isAvailable})
    .then(function(data){
      localStorage.profile = JSON.stringify(data);
      $rootScope.profileData = angular.copy(data);
    },function(data){
      console.log(data,"error");
    });
  }
}]);

askmonkApp.controller('bodyCtrl', ['$scope','utility','CONSTANT','$rootScope','CONSTANT','$ionicLoading','$timeout','$ionicHistory','$state','$ionicSideMenuDelegate','$ionicPlatform','$stateParams', function($scope,utility,CONSTANT,$rootScope,CONSTANT,$ionicLoading,$timeout,$ionicHistory,$state,$ionicSideMenuDelegate,$ionicPlatform,$stateParams){
	document.addEventListener("deviceready", onDeviceReady, false);
  $scope.showArrow = false;

  function onDeviceReady() {
  	console.log('deviceReady');
    document.addEventListener("online", onlineHandler, false);
    document.addEventListener("offline", offlineHandler, false);
    $timeout(function(){
      console.log(sessionStorage.redirectFromUrl,"session");
      if(sessionStorage.redirectFromUrl.indexOf('redirect/5')>-1){
        $timeout(function(){
          $scope.showMessage('Email validated. Happy askmonking');
        });
      }else{
        $state.go('app.singlequestion',{id:sessionStorage.redirectFromUrl.split('askmonk://')[1]}); 
      }
    }, 300);

    if(window.screen && window.screen.lockOrientation){
      window.screen.lockOrientation('portrait');
    }
  }

  function offlineHandler() {
    $scope.showMessage("Internet Connectivity error please try again");
  }
  function onlineHandler() {
    console.log('online');
  }
  
  $ionicPlatform.onHardwareBackButton(function() {
    if($ionicHistory.currentStateName() == "login"){

    }else{
      $ionicHistory.goBack();
    }
  }, 100);
  
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
      showBackdrop: false,
      template:'<ion-spinner icon="ripple" class="spinner-askmonk"></ion-spinner>'
    });
  };
  $scope.hideLoader = function(){
    $ionicLoading.hide();
    function success (status) {};
    function error (status) {};
    if(CONSTANT.isDevice){
      window.cache.clear(success, error);
    }
  };

  $scope.transitionAnimation = function(value,timer){
    $timeout(function(){
      window.plugins.nativepagetransitions.slide(
        {"direction":value},
        function (msg) {console.log("success: " + msg)}, // called when the animation has finished
        function (msg) {alert("error: " + msg)} // called in case you pass in weird values
      );
    }, timer?timer:500);
  };

  $scope.transitionAnimationUp = function(timer){
    $timeout(function(){
      window.plugins.nativepagetransitions.slide(
        {"direction":"up"},
        function (msg) {console.log("success: " + msg)}, // called when the animation has finished
        function (msg) {alert("error: " + msg)} // called in case you pass in weird values
      );
    }, timer?timer:500);
  }

  $scope.hamburgerBtnEvent = function(){
    if($state.current.name == 'app.editProfile' || $state.current.name == 'app.askQuestion' || $state.current.name == 'app.yprofile' || $state.current.name == 'app.singlequestion'){
      $timeout(function(){
        $ionicHistory.goBack();
        // if($ionicHistory.viewHistory.backView == null && $state.current.name == 'app.singlequestion'){
        //   $state.go('app.dashboard');
        // }
      }, 300);
      $scope.transitionAnimation('right',300);
    }else{
      
      $ionicSideMenuDelegate.toggleLeft();
    }
  }

  $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    if(fromState.name != "app.yprofile" && toState.name != 'app.askQuestion'){
      localStorage.removeItem('directQuestion');
    }
    if(toState.name == 'app.editProfile' || toState.name == 'app.askQuestion' || toState.name == 'app.yprofile' || toState.name == 'app.singlequestion'){
      $scope.showArrow = true;
    }else{
      $scope.showArrow = false;
    }
  });

  CONSTANT.loginType = localStorage.getItem('loginType');
}]);