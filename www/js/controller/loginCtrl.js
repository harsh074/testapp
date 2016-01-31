askmonkApp.controller('loginCtrl', ['$scope','$state','utility','CONSTANT','$ionicScrollDelegate','$timeout','$rootScope','$stateParams','$ionicModal', function($scope, $state,utility,CONSTANT,$ionicScrollDelegate,$timeout,$rootScope,$stateParams,$ionicModal){
  if(!$scope.authenticated){
    $scope.monkTab = true;
    $scope.userForgetPasswordShow = false;
    $scope.monkForgetPasswordShow = false;
    $scope.hideLoader();
    // $scope.args = {"email":"harsh.agarwal1112@gmail.com","password":"password"};
    // $scope.argsSignup = {"name":"harsh","email":"harsh@gmail.com","password":"password"};
    // $scope.conpassword = {"pass":"password"};

    $scope.args = {"email":"","password":"","ttl": 435456000000};
    $scope.argsSignup = {"name":"","email":"","password":""};
    $scope.conpassword = {"pass":""};
    $scope.argsMonk = {"email":"","password":"","ttl": 435456000000};

    $scope.userLoginForm = function() {
      $scope.userForgetPasswordShow = false;
      $scope.monkForgetPasswordShow = false;
      $scope.args.email = '';
      $scope.argsMonk.email = '';
      if($scope.userLoginModal && $scope.userLoginModal.isShown()){
        $scope.userLoginModal.remove();
      }
      $ionicModal.fromTemplateUrl('userLoginModal.html', function (modal) {
        $scope.userLoginModal = modal;
        $scope.userLoginModal.show();
      }, {
        scope: $scope,
        animation: 'slide-in-up'
      });
    }
    $scope.monkLoginForm =function() {
      $scope.userForgetPasswordShow = false;
      $scope.monkForgetPasswordShow = false;
      $scope.args.email = '';
      $scope.argsMonk.email = '';
      if($scope.monkLoginModal && $scope.monkLoginModal.isShown()){
        $scope.monkLoginModal.remove();
      }
      $ionicModal.fromTemplateUrl('monkLoginModal.html', function (modal) {
        $scope.monkLoginModal = modal;
        $scope.monkLoginModal.show();
      }, {
        scope: $scope,
        animation: 'slide-in-up'
      });
    }
    $scope.signUpTab = function(){
      $scope.monkTab = false; 
      $scope.signUptab = true;
      $timeout(function(){
        $ionicScrollDelegate.$getByHandle('loginScroll').scrollTo(0, 50, true);
      }, 10);
    }
    $scope.loginTab = function(){
      $scope.monkTab = true; 
      $scope.signUptab = false;
      $scope.userForgetPasswordShow = false;
      $scope.args.email = '';
    }
    $scope.loginMonkTab = function(){
      $scope.monkForgetPasswordShow = false;
      $scope.argsMonk.email = '';
    }

    $scope.forgetUserPasswordTab = function(){
      $scope.userForgetPasswordShow = true;
      $scope.args.email = '';
    }
    $scope.forgetMonkPasswordTab = function(){
      $scope.monkForgetPasswordShow = true;
      $scope.argsMonk.email = '';
    }
    $scope.userLogin = function(){
      $scope.showLoader();
      utility.login($scope.args)
      .then(function(data){
        $scope.setAuth(true);
        localStorage.setItem('loginType',"user");
        CONSTANT.loginType = "user";
        $state.go('app.profile');
        $scope.hideLoader();
        $scope.transitionAnimation('left',400);
        if($scope.userLoginModal && $scope.userLoginModal.isShown()){
          $scope.userLoginModal.remove();
        }
        $scope.registerNotificaton();
      },function(data){
        $scope.hideLoader();
        $scope.showMessage(data.error.message);
      });
    }
    
    $scope.monkLogin = function(){
      $scope.showLoader();
      if(CONSTANT.isDevice){
        cordova.plugins.Keyboard.close();
      }
      utility.monkLogin($scope.argsMonk)
      .then(function(data){
        $scope.setAuth(true);
        $state.go('app.profile');
        localStorage.setItem('loginType',"monk");
        CONSTANT.loginType = "monk";
        $scope.hideLoader();
        if(CONSTANT.isDevice){
          $scope.transitionAnimation('left',400);
        }
        if($scope.monkLoginModal && $scope.monkLoginModal.isShown()){
          $scope.monkLoginModal.remove();
        }
        $scope.registerNotificaton();
      },function(data){
        $scope.hideLoader();
        $scope.showMessage(data.error.message);
      });
      // $state.go('app.yprofile');
    }
    
    $scope.userSignUp = function(formData){
      if($scope.conpassword.pass != ""){
        if($scope.argsSignup.password != $scope.conpassword.pass){
          $scope.showMessage("Sorry, the passwords do not match");
          return;
        }
      }
      if($scope.argsSignup.name =="" || $scope.argsSignup.email =="" || $scope.argsSignup.password ==""){
        $scope.showMessage("All fields are required");
        return;
      }

      if(formData.$valid){
        $scope.showLoader();
        if(CONSTANT.isDevice){
          cordova.plugins.Keyboard.close();
        }
        utility.register($scope.argsSignup)
        .then(function(data){
          CONSTANT.isComingFromSignUp = true;
          localStorage.setItem("name",data.name);
          localStorage.setItem("email",data.email);
          utility.login({"email":data.email,"password":$scope.argsSignup.password})
          .then(function(dataLogin){
            $rootScope.token = localStorage.getItem('token');
            localStorage.setItem("profileData", JSON.stringify(data));
            $scope.setAuth(true);
            localStorage.setItem('loginType',"user");
            CONSTANT.loginType = "user";
            $state.go('app.editProfile');
            $scope.hideLoader();
            $scope.transitionAnimation('left');
            if($scope.userLoginModal && $scope.userLoginModal.isShown()){
              $scope.userLoginModal.remove();
            }
            $scope.registerNotificaton();
          },function(data){
            $scope.hideLoader();
            $scope.showMessage(data.error.message);
          });
        },function(data){
          $scope.hideLoader();
          if(data.error.status == 422){
            $scope.showMessage("Email address is already register");
          }
        });
      }else{
        $scope.showMessage("Please enter a valid email address");
        return;
      }
    }

    $scope.userForgetPassword = function(){
      $scope.showLoader();
      utility.forgetUserPassword($scope.args.email)
      .then(function(data){
        $scope.hideLoader();
        $scope.userLoginForm();
        $scope.showMessage('Mail sent');
      },function(data){
        $scope.hideLoader();
        console.log(data);
      });
    }
    $scope.monkForgetPassword = function(){
      $scope.showLoader();
      utility.forgetMonkPassword($scope.argsMonk.email)
      .then(function(data){
        $scope.hideLoader();
        $scope.monkLoginForm();
        $scope.showMessage('Mail sent');
      },function(data){
        $scope.hideLoader();
        console.log(data);
      });
    }

    $scope.closeModal = function(){
      if($scope.userLoginModal && $scope.userLoginModal.isShown()){
        $scope.userLoginModal.remove();
      }
      if($scope.monkLoginModal && $scope.monkLoginModal.isShown()){
        $scope.monkLoginModal.remove();
      }
    }

    $scope.registerNotificaton = function(){
      if ('android' === device.platform.toLowerCase()) {
        window.plugins.pushNotification.register(function () {
        },function () {
          alert("Push Notification registration FAIL on Android")
        },{
          ecb: 'window.onNotificationGCM',
          senderID: CONSTANT.pushSenderID // Google Project Number.
        });
      }
      // Method to handle device registration for Android.
      window.onNotificationGCM = function (e) {
        if('message' == e.event) {
          console.log(e);
          if(e.payload.questionId){
            if(e.payload.questionId == 12){
              $state.go('app.horoscope');
            }else{
              $state.go('app.singlequestion',{id:e.payload.questionId});
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
          console.log("success",data);
        },function(data){
          console.log("error",data);
        }); 
      }
    }

    $scope.userGoogleLogin = function(){
      $scope.showLoader();
      window.plugins.googleplus.login({'iOSApiKey': '915609605128-idn9dp6hnes236v35ko5pjhfmk4m8ap3.apps.googleusercontent.com'},
      function (obj) {
      //   alert(JSON.stringify(obj),"success");
        // var obj = {"email":"harsh.agarwal1112+16@gmail.com","displayName":"harsh9","gender":"male"};
        utility.googleOauth(obj)
        .then(function(data){
          $scope.setAuth(true);
          localStorage.setItem('loginType',"user");
          localStorage.setItem('token',data.id);
          localStorage.setItem('userId',data.userId);
          // localStorage.setItem('firstTimeLogin',data.firstTimeLogin)
          CONSTANT.loginType = "user";
          if(data.firstTimeLogin){
            $rootScope.profileData = angular.copy(obj);
            $rootScope.profileData.name = angular.copy($rootScope.profileData.displayName);
            CONSTANT.isComingFromSignUp = true;
            $state.go('app.editProfile');
          }else{
            $state.go('app.profile');
          }
          $scope.hideLoader();
          $scope.transitionAnimation('left',480);
          if($scope.userLoginModal && $scope.userLoginModal.isShown()){
            $scope.userLoginModal.remove();
          }
          $scope.registerNotificaton();
        },function(data){
          $scope.hideLoader();
          $scope.showMessage(data.error.message);
          console.log("error",data);
        });
      },
      function (msg) {
        $scope.hideLoader();
        console.log(JSON.stringify(msg),"error");
      });
    }
  }
  else if(localStorage.getItem('questionStatus') == "underObeservation"){
    $stateParams.id = localStorage.getItem('questionId');
    $state.go('app.singlequestion',$stateParams);
    $scope.transitionAnimation('left',180);
  }else{
    $state.go('app.dashboard');
    $scope.transitionAnimation('left',180);
  }
}]);