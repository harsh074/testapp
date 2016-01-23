askmonkApp.controller('settingCtrl', ['$scope','utility','$ionicHistory','$rootScope','$http','$state','$templateCache','$ionicModal','$ionicPopup','CONSTANT', function($scope,utility,$ionicHistory,$rootScope,$http,$state,$templateCache,$ionicModal,$ionicPopup,CONSTANT){

  $scope.aboutUs = function(){
    $ionicModal.fromTemplateUrl('views/aboutUsModal.html', function (modal) {
      $scope.aboutUsModal = modal;
      $scope.aboutUsModal.show();
    }, {
      scope: $scope,
      animation: 'slide-in-up'
    });
  }
  $scope.loginType = CONSTANT.loginType;

  $scope.privacyPolicy = function(){
    $ionicModal.fromTemplateUrl('views/privacyPolicyModal.html', function (modal) {
      $scope.privacyPolicyModal = modal;
      $scope.privacyPolicyModal.show();
    }, {
      scope: $scope,
      animation: 'slide-in-up'
    });
  }

  $scope.openBlog = function(){
    window.open('https://askmonkblog.wordpress.com', '_system', 'location=yes'); 
    return false;
  }

  $scope.helpDesk = function(){
    window.plugins.socialsharing.shareViaEmail(
      null,
      null,
      ['support@askmonk.in'], // TO: must be null or an array
      null, // CC: must be null or an array
      null, // BCC: must be null or an array
      null, // FILES: null, a string, or an array
      onSuccess = function(){
        $scope.showMessage('Please share your query');  
      },
      onError = function(e){
        $scope.showMessage('Something went wrong. Please try again');  
      }
    );
  }
  $scope.shareWhatsapp = function(){
    window.plugins.socialsharing.shareViaWhatsApp(
      'Share Askmonk',
      'http://askmonk.in/images/askmonk_logo_white.png',
      'http://askmonk.in',
      function() {console.log('share ok')},
      function(errormsg){console.log(errormsg)}
    );
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

  $scope.logOut = function(){
    var confirmPopup = $ionicPopup.show({
      cssClass:"ios",
      title: 'Do you want to logout of askmonk?',
      // template:'Do u wish to continue ?',
      buttons: [
        {text: 'Yes',type:'button-ios button-clear',
          onTap: function(e) {
            return true;
          }
        },
        {text:'No',type:'button-ios button-clear',
          onTap: function(e) {
            return false;
          }
        }
      ]
    });
    confirmPopup.then(function(res) {
      if(res) {
        console.log('You are sure');
        if($scope.loginType == 'monk'){
          var monkProfile = JSON.parse(localStorage.profile);
          utility.updateMonkAvailableStatus({id:monkProfile.id,email:monkProfile.email,isAvailable:false})
          .then(function(data){
            $scope.logout();
          },function(data){
            console.log(data,'error');
          });
        }else{
          $scope.logout();
        }
      } else {
        console.log('You are not sure');
      }
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
      // localStorage.removeItem('token');
      // localStorage.removeItem('userId');
      // localStorage.removeItem("name");
      // localStorage.removeItem("email");
      // localStorage.removeItem('loginType');
      // localStorage.removeItem("profile");
      localStorage.clear();
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

askmonkApp.controller('changePasswordModalCtrl', ['$scope','utility','CONSTANT','$ionicPopup', function($scope,utility,CONSTANT,$ionicPopup){

  $scope.model = {"password":""};
  $scope.args = {"con_password":""};
  // $scope.loginType = CONSTANT.loginType;
  $scope.passwordChangePopup = function(formData){
    var confirmPopup = $ionicPopup.show({
      cssClass:"ios",
      title: 'Do you want to change your password?',
      // template:'Do u wish to continue ?',
      buttons: [
        {text: 'Yes',type:'button-ios button-clear',
          onTap: function(e) {
            return true;
          }
        },
        {text:'No',type:'button-ios button-clear',
          onTap: function(e) {
            return false;
          }
        }
      ]
    });
    confirmPopup.then(function(res) {
      if(res) {
        console.log('You are sure');
        $scope.passwordChange(formData);
      } else {
        console.log('You are not sure');
      }
    });
  }
  $scope.passwordChange = function(formData) {
    if(!$scope.model.password || !$scope.args.con_password){
      $scope.showMessage("All fields are required");
    }
    // console.log($scope.model.password,$scope.args.con_password);
    if($scope.model.password !== $scope.args.con_password){
      $scope.showMessage("Passwords don't match");
    }else{
      $scope.showLoader();
      if (CONSTANT.loginType=='user') {
        utility.changeUserPassword($scope.model)
        .then(function(data) {
          $scope.hideLoader();
          console.log(data,"success");
          $scope.closeModal();
          $scope.showMessage("Password change successfully");
        }, function(data) {
          $scope.hideLoader();
          console.log(data,"errors");
        });
      }else{
        utility.changeMonkPassword($scope.model)
        .then(function(data) {
          $scope.hideLoader();
          console.log(data,"success");
          $scope.closeModal();
          $scope.showMessage("Password change successfully");
        }, function(data) {
          $scope.hideLoader();
          console.log(data,"errors");
        });
      }
    }
  }
}]);