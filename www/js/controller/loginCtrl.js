askmonkApp.controller('loginCtrl', ['$scope','$state','utility','CONSTANT','$ionicScrollDelegate','$timeout','$rootScope', function($scope, $state,utility,CONSTANT,$ionicScrollDelegate,$timeout,$rootScope) {
  if(!$scope.authenticated){
    $scope.activeUserTab = true;
    $scope.activeMonkTab = false;
    $scope.monkTab = true;

    // $scope.args = {"email":"harsh.agarwal1112@gmail.com","password":"password"};
    // $scope.argsSignup = {"name":"harsh","email":"harsh@gmail.com","password":"password"};
    // $scope.conpassword = {"pass":"password"};

    $scope.args = {"email":"","password":""};
    $scope.argsSignup = {"name":"","email":"","password":""};
    $scope.conpassword = {"pass":""};

    $scope.userLoginForm =function() {
      $scope.activeUserTab = true;
      $scope.activeMonkTab = false;
    }

    $scope.monkLoginForm =function() {
      $scope.activeUserTab = false;
      $scope.activeMonkTab = true;
    }

    $scope.userLogin = function(){
      $scope.showLoader();
      if(CONSTANT.isDevice){
        cordova.plugins.Keyboard.close();
      }
      utility.login($scope.args)
      .then(function(data){
        $scope.setAuth(true);
        $scope.hideLoader();
        $state.go('app.profile');
      },function(data){
        $scope.hideLoader();
        $scope.showMessage(data.error.message);
      });
    }
    $scope.monkLogin = function(){
      $state.go('app.profile'); 
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
        cordova.plugins.Keyboard.close();
        utility.register($scope.argsSignup)
        .then(function(data){
          CONSTANT.isComingFromSignUp = true;
          localStorage.setItem("name",data.name);
          utility.login({"email":data.email,"password":$scope.argsSignup.password})
          .then(function(dataLogin){
            $scope.hideLoader();
            $rootScope.token = localStorage.getItem('token');
            localStorage.setItem("profileData", JSON.stringify(data));
            $scope.setAuth(true);
            $state.go('app.editProfile');
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
  }else{
    $state.go('app.profile');
  }
}]);