askmonkApp.controller('loginCtrl', ['$scope','$state','utility','ipCookie','CONSTANT','$ionicScrollDelegate','$timeout','$rootScope', function($scope, $state,utility,ipCookie,CONSTANT,$ionicScrollDelegate,$timeout,$rootScope) {
  if(!$scope.authenticated){
    $scope.activeUserTab = true;
    $scope.activeMonkTab = false;
    $scope.monkTab = true;

    // $scope.args = {"email":"harsh.agarwal1112@gmail.com","password":"password"};
    // $scope.argsSignup = {"name":"harsh","email":"harsh@gmail.com","password":"password"};
    // $scope.conpassword = "password";
    $scope.args = {"email":"","password":""};
    $scope.argsSignup = {"name":"","email":"","password":""};
    $scope.conpassword = "";

    $scope.userLoginForm =function() {
      $scope.activeUserTab = true;
      $scope.activeMonkTab = false;
    }

    $scope.monkLoginForm =function() {
      $scope.activeUserTab = false;
      $scope.activeMonkTab = true;
    }

    $scope.userLogin = function(){
      utility.login($scope.args)
      .then(function(data){
        $scope.setAuth(true);
        $state.go('app.profile');
      },function(data){
        $scope.showMessage(data.error.message)
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
      if($scope.conpassword != ""){
        if($scope.argsSignup.password != $scope.conpassword){
          $scope.showMessage("Sorry, the passwords do not match");
          return;
        }
      }
      if($scope.argsSignup.name =="" || $scope.argsSignup.email =="" || $scope.argsSignup.password ==""){
        $scope.showMessage("All fields are required");
        return;
      }

      if(formData.$valid){
        utility.register($scope.argsSignup)
        .then(function(data){
          CONSTANT.isComingFromSignUp = true;
          utility.login({"email":data.email,"password":$scope.argsSignup.password})
          .then(function(dataLogin){
            $rootScope.token = ipCookie('token');
            localStorage.setItem("profileData", JSON.stringify(data));
            $scope.setAuth(true);
            $state.go('app.editProfile');
          },function(data){
            $scope.showMessage(data.error.message);
          });
        },function(data){
          if(data.error.status == 422){
            $scope.showMessage("Email address is already register");
          }
        });
      }else{
        $scope.showMessage("Please enter a valid email address");
        return;
      }

      console.log($scope.argsSignup);
    }
  }else{
    $state.go('app.profile');
  }

}]);