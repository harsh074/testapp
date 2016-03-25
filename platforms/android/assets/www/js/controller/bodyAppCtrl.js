askmonkApp.controller('appCtrl', ['$scope','CONSTANT','$state','utility','$rootScope','$timeout','$ionicPopup', function($scope,CONSTANT,$state,utility,$rootScope,$timeout,$ionicPopup){
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
      $scope.profileInfo = JSON.parse(localStorage.profile);
      $scope.profileImage = 'http://askmonk.in/mImages/'+$scope.profileInfo.email.split('@')[0].toLowerCase()+'.jpg';
    }
  }
  $scope.$on("updateAvaliableStatus",function() {
    $scope.isAvailable={};
    $scope.isAvailable.status = JSON.parse(localStorage.profile).isAvailable;
    $scope.profileInfo = JSON.parse(localStorage.profile);
    $scope.profileImage = 'http://askmonk.in/mImages/'+$scope.profileInfo.email.split('@')[0].toLowerCase()+'.jpg';
  });

  // Get Direct question popup
  $scope.getDirectQuestionCount = function(){
    utility.getDirectQuestionCount()
    .then(function(data){
      if(data.length>0){
        $scope.showDirectQuestionCountPopup(data);
      }
    },function(data){
      if(data && data.error.statusCode == 422){
        $scope.showMessage(data.error.message);
      }else{
        $scope.showMessage("Something went wrong. Please try again.");
      }
      // console.log(data)
    });
  }
  $scope.showDirectQuestionCountPopup = function(data){
    var confirmPopup = $ionicPopup.show({
      cssClass:"ios",
      title: data.count+' direct questions unanswered.',
      template:'Want to answer now?',
      scope:$scope,
      buttons: [
        {text: 'Ok',type:'button-ios button-clear',
          onTap: function(e) {
            return true;
          }
        },
        {text:'Cancel',type:'button-ios button-clear',
          onTap: function(e) {
            return false;
          }
        }
      ]
    });
    confirmPopup.then(function(res) {
      if(res) {
        console.log('You are sure');
        $state.go('app.directQuestion');
      } else {
        console.log('You are not sure');
      }
    });
  }
  
  $scope.changeAvaliableStatus = function(){
    $scope.profileData = JSON.parse(localStorage.profile);
    if($scope.isAvailable.status){
      $scope.getDirectQuestionCount();
    }
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

askmonkApp.controller('bodyCtrl', ['$scope','utility','CONSTANT','$rootScope','CONSTANT','$ionicLoading','$timeout','$ionicHistory','$state','$ionicSideMenuDelegate','$ionicPlatform','$stateParams','HardwareBackButtonManager','$ionicNativeTransitions', function($scope,utility,CONSTANT,$rootScope,CONSTANT,$ionicLoading,$timeout,$ionicHistory,$state,$ionicSideMenuDelegate,$ionicPlatform,$stateParams,HardwareBackButtonManager,$ionicNativeTransitions){
	document.addEventListener("deviceready", onDeviceReady, false);
  $scope.showArrow = false;

	$scope.showMessage = function(message) {
    window.plugins.toast.showWithOptions({
      message: message,
      duration: "long",
      position: "bottom",
      addPixelsY: -20
    },
    function(){
      console.log('sucess');
    },
    function(){
      console.log('error');
    });
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
          }else if(e.payload.questionId == 50){
            $state.go('app.profile');
          }else{
            if(e.payload.notificationType == 'Article'){
              $state.go('app.broadcastquestion',{id:e.payload.questionId});
            }else if(e.payload.notificationType == 'Question'){
              $state.go('app.singlequestion',{id:e.payload.questionId});
            }else{
              $state.go('app.profile');
            }
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
    var backState = $ionicHistory.viewHistory().backView.stateName;
    var currentState = $ionicHistory.viewHistory().currentView.stateName;
    if((currentState == 'app.editProfile' || currentState=='app.profile')&&(backState=='login')){
      // $state.go(currentState);
      ionic.Platform.exitApp();
    }else if(currentState=='login' && backState=='app.setting'){
      ionic.Platform.exitApp();
    }else if(currentState=='login' && backState=='app.profile'){
      ionic.Platform.exitApp();
    }
  },150);
  /*$ionicPlatform.registerBackButtonAction(function() {
    if($ionicHistory.currentStateName() == "login"){

    }else{
      $ionicHistory.goBack();
    }
  },100);*/
  
  utility.initialize(CONSTANT.baseUrl, false, $scope, $rootScope);

  $scope.showLoader = function(duration) {
    $ionicLoading.show({
      animation: 'fade-in',
      showBackdrop: false,
      template:'<ion-spinner icon="android" class="spinner-askmonk"></ion-spinner>'
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
      /*$timeout(function(){
        $ionicHistory.goBack();
        $ionicHistory.viewHistory().backView..url
        var options = {
          "duration"    : 500,
          "androiddelay": -1
        };
        window.plugins.nativepagetransitions.fade(
          options,
          function (msg) {console.log("success: " + msg)}, // called when the animation has finished
          function (msg) {alert("error: " + msg)} // called in case you pass in weird values
        );
        // if($ionicHistory.viewHistory.backView==null&&$state.current.name=='app.singlequestion'){
        //   $state.go('app.dashboard');
        // }
      }, 50);*/
      if(cordova.plugins.Keyboard.isVisible){
        cordova.plugins.Keyboard.close();
      }
      $timeout(function(){
        $ionicNativeTransitions.locationUrl($ionicHistory.viewHistory().backView.url, {
          "type": "fade",
          "duration": 450,
        });
      }, 10);
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