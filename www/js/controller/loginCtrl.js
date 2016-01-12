askmonkApp.controller('loginCtrl', ['$scope','$state','utility','CONSTANT','$ionicScrollDelegate','$timeout','$rootScope','$stateParams', function($scope, $state,utility,CONSTANT,$ionicScrollDelegate,$timeout,$rootScope,$stateParams){
  if(!$scope.authenticated){
    $scope.activeUserTab = true;
    $scope.activeMonkTab = false;
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

    $scope.userLoginForm =function() {
      $scope.activeUserTab = true;
      $scope.activeMonkTab = false;
      $scope.userForgetPasswordShow = false;
      $scope.monkForgetPasswordShow = false;
      $scope.args.email = '';
      $scope.argsMonk.email = '';
    }
    $scope.monkLoginForm =function() {
      $scope.activeUserTab = false;
      $scope.activeMonkTab = true;
      $scope.userForgetPasswordShow = false;
      $scope.monkForgetPasswordShow = false;
      $scope.args.email = '';
      $scope.argsMonk.email = '';
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
      $timeout(function(){
        $ionicScrollDelegate.$getByHandle('loginScroll').scrollTo(0, 0, true);
      }, 10);
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
        $scope.transitionAnimation('left',480);
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
          $scope.transitionAnimation('left',480);
        }
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