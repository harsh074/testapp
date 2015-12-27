askmonkApp.controller('settingCtrl', ['$scope','utility','$ionicHistory','$rootScope','$http','$state','$templateCache','$ionicModal', function($scope,utility,$ionicHistory,$rootScope,$http,$state,$templateCache,$ionicModal){

  $scope.aboutUs = function(){
    $ionicModal.fromTemplateUrl('views/aboutUsModal.html', function (modal) {
      $scope.aboutUsModal = modal;
      $scope.aboutUsModal.show();
    }, {
      scope: $scope,
      animation: 'slide-in-up'
    });
  }

  $scope.privacyPolicy = function(){
    $ionicModal.fromTemplateUrl('views/privacyPolicyModal.html', function (modal) {
      $scope.privacyPolicyModal = modal;
      $scope.privacyPolicyModal.show();
    }, {
      scope: $scope,
      animation: 'slide-in-up'
    });
  }

  $scope.changePassword = function(){
    $ionicModal.fromTemplateUrl('views/changePasswordModal.html', function (modal) {
      $scope.changePasswordModal = modal;
      $scope.changePasswordModal.show();
    }, {
      scope: $scope,
      animation: 'slide-in-up'
    });
  }

  $scope.logout = function(){
    $scope.showLoader();
  	utility.logout()
    .then(function(data){
      $scope.hideLoader();
      $state.go('login');
      $scope.transitionAnimation('left');
      $scope.setAuth(false);
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      var currentPageTemplate = $state.current.templateUrl;
      $templateCache.remove(currentPageTemplate);
      $rootScope.profileData = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem('loginType');
      $scope.loginType = localStorage.getItem('loginType');
      delete $http.defaults.headers.common.Authorization;
    },function(data){
      console.log(data,'error');
    });
  }


  $scope.closeModal = function(){
    if($scope.aboutUsModal && $scope.aboutUsModal.isShown()){
      $scope.aboutUsModal.remove();
    }
    if($scope.privacyPolicyModal && $scope.privacyPolicyModal.isShown()){
      $scope.privacyPolicyModal.remove();
    }
    if($scope.changePasswordModal && $scope.changePasswordModal.isShown()){
      $scope.changePasswordModal.remove();
    }
  }
}]);

askmonkApp.controller('changePasswordModalCtrl', ['$scope','utility','CONSTANT', function($scope,utility,CONSTANT){

  $scope.model = {"password":""};
  $scope.args = {"con_password":""};
  // $scope.loginType = CONSTANT.loginType;

  $scope.passwordChange = function(formData) {
    if(!$scope.model.password || !$scope.args.con_password){
      $scope.showMessage("All fields are required");
    }
    // console.log($scope.model.password,$scope.args.con_password);
    if($scope.model.password !== $scope.args.con_password){
      $scope.showMessage("Passwords don't match");
    }else{
      if (CONSTANT.loginType=='user') {
        utility.changeUserPassword($scope.model)
        .then(function(data) {
          console.log(data,"success");
          $scope.closeModal();
        }, function(data) {
          console.log(data,"errors");
        });
      }else{
        utility.changeMonkPassword($scope.model)
        .then(function(data) {
          console.log(data,"success");
          $scope.closeModal();
        }, function(data) {
          console.log(data,"errors");
        });
      }
    }
  }
}]);