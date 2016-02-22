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
  };
  if(CONSTANT.loginType == 'monk'){
    $scope.isAvailable={};
    if(localStorage.profile){
      $scope.isAvailable.status = JSON.parse(localStorage.profile).isAvailable;
    }
  }
  $scope.$on("updateAvaliableStatus",function() {
    $scope.isAvailable={};
    $scope.isAvailable.status = JSON.parse(localStorage.profile).isAvailable;
  });
  
  $scope.changeAvaliableStatus = function(){
    $scope.profileData = JSON.parse(localStorage.profile);
    utility.updateMonkAvailableStatus({id:$scope.profileData.id,email:$scope.profileData.email,isAvailable:$scope.isAvailable.status})
    .then(function(data){
      localStorage.profile = JSON.stringify(data);
      $rootScope.profileData = angular.copy(data);
    },function(data){
      if(data && data.error.statusCode == 422){
        $scope.showMessage(data.error.message);
      }else{
        $scope.showMessage("Something went wrong. Please try again.");
      }
      console.log(data,"error");
    });
  }
}]);

askmonkApp.controller('bodyCtrl', ['$scope','utility','CONSTANT','$rootScope','CONSTANT','$ionicLoading','$timeout','$ionicHistory','$state','$ionicSideMenuDelegate','$ionicPlatform','$stateParams', function($scope,utility,CONSTANT,$rootScope,CONSTANT,$ionicLoading,$timeout,$ionicHistory,$state,$ionicSideMenuDelegate,$ionicPlatform,$stateParams){
	document.addEventListener("deviceready", onDeviceReady, false);
  $scope.showArrow = false;

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

  function onDeviceReady() {
    if($scope.authenticated){
      $scope.registerNotificaton();
    }
    console.log('deviceReady');
    document.addEventListener("online", onlineHandler, false);
    document.addEventListener("offline", offlineHandler, false);
    
    $timeout(function(){
      console.log(sessionStorage.redirectFromUrl,"session");
      if(sessionStorage.redirectFromUrl.split('askmonk://')[1] == 5){
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
  
  $scope.registerNotificaton = function(){
    if('android' === device.platform.toLowerCase()) {
      window.plugins.pushNotification.register(function () {
      },function () {
        alert("Push Notification registration FAIL on Android")
      },{
        ecb: 'window.onNotificationGCM',
        senderID: CONSTANT.pushSenderID // Google Project Number.
      });
    }
  }
  // Method to handle device registration for Android.
  window.onNotificationGCM = function (e) {
    if('message' == e.event) {
      console.log(e,$scope.authenticated);
      if(e.payload.questionId){
        if($scope.authenticated){
          if(e.payload.questionId == 12){
            $state.go('app.horoscope');
          }else if(e.payload.questionId == 1){
            $state.go('app.askQuestion');
          }else{
            $state.go('app.singlequestion',{id:e.payload.questionId});
          }
        }
      }
    }else if('registered' === e.event) {
      window.registrationHandler(e.regid);
    }
    else if ('error' === e.event) {
      console.log("error",e);
    }
  };
  window.registrationHandler = function(_deviceId){
    $scope.deviceInfo = {"deviceType":window.device.platform,"userId":localStorage.userId,"deviceId":_deviceId}
    // alert($scope.deviceInfo);
    utility.notification($scope.deviceInfo)
    .then(function(data){
      console.log("success",JSON.stringify(data));
    },function(data){
      if(data && data.error.statusCode == 422){
        $scope.showMessage(data.error.message);
      }else{
        $scope.showMessage("Something went wrong. Please try again.");
      }
      // console.log("error",JSON.stringify(data));
    }); 
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
  },150);
  
  utility.initialize(CONSTANT.baseUrl, false, $scope, $rootScope);

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
    console.log(value,timer);
  };

  $scope.hamburgerBtnEvent = function(){
    if($state.current.name == 'app.editProfile' || $state.current.name == 'app.askQuestion' || $state.current.name == 'app.yprofile' || $state.current.name == 'app.singlequestion'||$state.current.name == 'app.broadcastquestion' ){
      $timeout(function(){
        $ionicHistory.goBack();
        // if($ionicHistory.viewHistory.backView==null&&$state.current.name=='app.singlequestion'){
        //   $state.go('app.dashboard');
        // }
      }, 300);
    }else{
      $ionicSideMenuDelegate.toggleLeft();
    }
  }

  $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    if(fromState.name != "app.yprofile" && toState.name != 'app.askQuestion'){
      localStorage.removeItem('directQuestion');
    }
    if(toState.name == 'app.editProfile' || toState.name == 'app.askQuestion' || toState.name == 'app.yprofile' || toState.name == 'app.singlequestion' || toState.name == 'app.broadcastquestion'){
      $scope.showArrow = true;
    }else{
      $scope.showArrow = false;
    }
  });

  CONSTANT.loginType = localStorage.getItem('loginType');
}]);