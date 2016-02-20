askmonkApp.controller('loginCtrl', ['$scope','$state','utility','CONSTANT','$ionicScrollDelegate','$timeout','$rootScope','$stateParams','$ionicModal','$ionicSlideBoxDelegate','base64Encoding', function($scope, $state,utility,CONSTANT,$ionicScrollDelegate,$timeout,$rootScope,$stateParams,$ionicModal,$ionicSlideBoxDelegate,base64Encoding){
  // console.log(base64Encoding.encode(JSON.stringify(a)));
  
  if(!$scope.authenticated){
    $scope.monkTab = true;
    $scope.userForgetPasswordShow = false;
    $scope.userResendValidatonShow = false;
    $scope.monkForgetPasswordShow = false;
    $scope.hideLoader();
    $scope.showNextButton = true;
    
    // $scope.args = {"email":"harsh.agarwal1112@gmail.com","password":"password","ttl": 435456000000};
    // $scope.argsSignup = {"name":"harsh","email":"harsh.agarwal1112@gmail.com","password":"password","ttl": 435456000000};
    // $scope.conpassword = {"pass":"password"};

    $scope.args = {"email":"","password":"","ttl": 435456000000};
    $scope.argsSignup = {"name":"","email":"","password":""};
    $scope.conpassword = {"pass":""};
    $scope.argsMonk = {"email":"","password":"","ttl": 435456000000};

    $scope.$on('$ionicView.loaded',function(){
      $timeout(function(){
        for(var i=1;i<4;i++){
          var videoTag = angular.element(document.getElementById('video'+i));
          videoTag[0].load();
        }
      }, 500);
    });
    $scope.slideHasChanged = function(index){
      var videoTag = angular.element(document.getElementById('video'+index));
      if(index>0){
        videoTag[0].currentTime = 0;
        videoTag[0].play();
      }
      if(index == 3){
        $scope.showNextButton = false;
      }else{
        $scope.showNextButton = true;
      }
    }
    $scope.changeToNextSlide = function(){
      $ionicSlideBoxDelegate.next();
    }

    $scope.openTnC = function(){
      window.open('http://askmonk.in/privacy.html', '_system', 'location=yes'); 
      return false;
    }

    $scope.userLoginForm = function() {
      $scope.userForgetPasswordShow = false;
      $scope.monkForgetPasswordShow = false;
      $scope.userResendValidatonShow = false;
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
      $scope.userResendValidatonShow = false;
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
      $scope.userResendValidatonShow = false;
      $scope.args.email = '';
    }
    $scope.loginMonkTab = function(){
      $scope.monkForgetPasswordShow = false;
      $scope.argsMonk.email = '';
    }

    $scope.forgetUserPasswordTab = function(){
      $scope.userForgetPasswordShow = true;
      $scope.userResendValidatonShow = false;
      $scope.args.email = '';
    }
    $scope.resendValidationTab = function(){
      $scope.userForgetPasswordShow = true;
      $scope.userResendValidatonShow = true;
      $scope.args.email = '';
    }
    $scope.forgetMonkPasswordTab = function(){
      $scope.monkForgetPasswordShow = true;
      $scope.argsMonk.email = '';
    }
    $scope.userLogin = function(formData){
      if(!formData.userEmail.$viewValue || !formData.userEmail.$valid){
        $scope.showMessage("Please enter the correct email address");
        return;
      }
      if(!formData.userPassword.$viewValue || !formData.userPassword.$valid){
        $scope.showMessage("Please enter the correct password");
        return;
      }
      $scope.showLoader();
      utility.login($scope.args)
      .then(function(data){
        $scope.setAuth(true);
        localStorage.setItem('loginType',"user");
        CONSTANT.loginType = "user";
        $state.go('app.profile');
        $scope.hideLoader();
        if($scope.userLoginModal && $scope.userLoginModal.isShown()){
          $scope.userLoginModal.remove();
        }
        $scope.registerNotificaton();
        $scope.transitionAnimation('left',1500);
      },function(data){
        $scope.hideLoader();
        if(data){
          $scope.showMessage(data.error.message);
        }else{
          $scope.showMessage("Something went wrong. Please try again.");
        }
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
        if($scope.monkLoginModal && $scope.monkLoginModal.isShown()){
          $scope.monkLoginModal.remove();
        }
        $scope.registerNotificaton();
        $scope.transitionAnimation('left',1400);
      },function(data){
        $scope.hideLoader();
        if(data){
          $scope.showMessage(data.error.message);
        }else{
          $scope.showMessage("Something went wrong. Please try again.");
        }
      });
      // $state.go('app.yprofile');
    }
    
    $scope.userSignUp = function(formData){
      if(!formData.email.$viewValue || !formData.email.$valid){
        $scope.showMessage("Please enter the correct email address");
        return;
      }
      if(!formData.password.$viewValue || !formData.password.$valid){
        $scope.showMessage("Minimum password limit 6.");
        return;
      }
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
        // console.log("valid");
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
            if($scope.userLoginModal && $scope.userLoginModal.isShown()){
              $scope.userLoginModal.remove();
            }
            $scope.registerNotificaton();
            $scope.transitionAnimation('left',500);
          },function(data){
            $scope.hideLoader();
            if(data){
              $scope.showMessage(data.error.message);
            }else{
              $scope.showMessage("Something went wrong. Please try again.");
            }
            // $scope.showMessage(data.error.message);
          });
        },function(data){
          $scope.hideLoader();
          if(data && data.error.status == 422){
            $scope.showMessage("Email address is already register");
          }else{
            $scope.showMessage("Something went wrong. Please try again.");
          }
        });
      }else{
        $scope.showMessage("Please share the right details");
        return;
      }
    }

    $scope.userForgetPassword = function(){
      $scope.showLoader();
      utility.forgetUserPassword(base64Encoding.encode($scope.args.email))
      .then(function(data){
        $scope.hideLoader();
        $scope.userLoginForm();
        $scope.showMessage('Mail sent');
      },function(data){
        $scope.hideLoader();
        if(data && data.error.statusCode == 422){
          $scope.showMessage(data.error.message);
        }else{
          $scope.showMessage("Something went wrong. Please try again.");
        }
        console.log(data);
      });
    }
    $scope.userResendValidation = function(){
      $scope.showLoader();
      utility.resendValidationUser(base64Encoding.encode($scope.args.email))
      .then(function(data){
        $scope.hideLoader();
        $scope.userLoginForm();
        $scope.showMessage('Mail sent');
      },function(data){
        $scope.hideLoader();
        if(data && data.error.statusCode == 422){
          $scope.showMessage(data.error.message);
        }else{
          $scope.showMessage("Something went wrong. Please try again.");
        }
        console.log(data);
      });
    }
    $scope.monkForgetPassword = function(){
      $scope.showLoader();
      utility.forgetMonkPassword(base64Encoding.encode($scope.argsMonk.email))
      .then(function(data){
        $scope.hideLoader();
        $scope.monkLoginForm();
        $scope.showMessage('Mail sent');
      },function(data){
        $scope.hideLoader();
        if(data && data.error.statusCode == 422){
          $scope.showMessage(data.error.message);
        }else{
          $scope.showMessage("Something went wrong. Please try again.");
        }
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

    $scope.userGoogleLogin = function(){
      $scope.showLoader();
      window.plugins.googleplus.login({'iOSApiKey': '915609605128-idn9dp6hnes236v35ko5pjhfmk4m8ap3.apps.googleusercontent.com'},
      function (obj) {
        // alert(JSON.stringify(obj),"success");
        // var obj = {"email":"harsh.agarwal1112+16@gmail.com","displayName":"harsh9","gender":"male"};
        utility.googleOauth(obj)
        .then(function(data){
          // alert(JSON.stringify(data),"Server Responce on google login");
          $scope.setAuth(true);
          localStorage.setItem('loginType',"user");
          localStorage.setItem('token',data.id);
          localStorage.setItem('userId',data.userId);
          CONSTANT.loginType = "user";
          if(data.firstTimeLogin){
            localStorage.setItem("name",obj.givenName);
            localStorage.setItem("email",obj.email);
            $rootScope.profileData = angular.copy(obj);
            $rootScope.profileData.name = angular.copy($rootScope.profileData.displayName);
            CONSTANT.isComingFromSignUp = true;
            $state.go('app.editProfile');
          }else{
            $state.go('app.profile');
          }
          if($scope.userLoginModal && $scope.userLoginModal.isShown()){
            $scope.userLoginModal.remove();
          }
          $scope.registerNotificaton();
          $scope.hideLoader();
          $scope.transitionAnimation('left',900);
        },function(data){
          $scope.hideLoader();
          if(data && data.error.statusCode == 422){
            $scope.showMessage(data.error.message);
          }else{
            $scope.showMessage("Something went wrong. Please try again.");
          }
          // $scope.showMessage(data.error.message);
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

askmonkApp.filter('trusted', ['$sce', function ($sce) {
  return function(url) {
    return $sce.trustAsResourceUrl(url);
  };
}]);