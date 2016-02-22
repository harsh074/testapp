askmonkApp.controller('settingCtrl', ['$scope','utility','$ionicHistory','$rootScope','$http','$state','$templateCache','$ionicModal','$ionicPopup','CONSTANT', function($scope,utility,$ionicHistory,$rootScope,$http,$state,$templateCache,$ionicModal,$ionicPopup,CONSTANT){

  $scope.loginType = CONSTANT.loginType;
  $scope.aboutUs = function(){
    $ionicModal.fromTemplateUrl('views/aboutUsModal.html', function (modal) {
      $scope.aboutUsModal = modal;
      $scope.aboutUsModal.show();
    }, {
      scope: $scope,
      animation: 'slide-in-right'
    });
  }

  $scope.privacyPolicy = function(){
    $ionicModal.fromTemplateUrl('views/privacyPolicyModal.html', function (modal) {
      $scope.privacyPolicyModal = modal;
      $scope.privacyPolicyModal.show();
    }, {
      scope: $scope,
      animation: 'slide-in-right'
    });
  }

  $scope.openBlog = function(){
    window.open('https://askmonkblog.wordpress.com', '_system', 'location=yes'); 
    return false;
  }

  $scope.getPaymentInfo = function(){
    $scope.showLoader();
    if($scope.loginType == "user"){
      utility.userPaymentInfo()
      .then(function(data){
        $scope.hideLoader();
        console.log(data);
        $scope.paymentReceipts = data;
        $ionicModal.fromTemplateUrl('paymentInfoModal.html', function (modal) {
          $scope.paymentInfoModal = modal;
          $scope.paymentInfoModal.show();
        }, {
          scope: $scope,
          animation: 'slide-in-right'
        });
      },function(data){
        $scope.hideLoader();
        if(data && data.error.statusCode == 422){
          $scope.showMessage(data.error.message);
        }else{
          $scope.showMessage("Something went wrong. Please try again.");
        }
      });
    }else{
      utility.monkPaymentInfo()
      .then(function(data){
        $scope.hideLoader();
        console.log(data);
        $scope.paymentReceipts = data;
        $ionicModal.fromTemplateUrl('paymentInfoModal.html', function (modal) {
          $scope.paymentInfoModal = modal;
          $scope.paymentInfoModal.show();
        }, {
          scope: $scope,
          animation: 'slide-in-right'
        });
      },function(data){
        $scope.hideLoader();
        if(data && data.error.statusCode == 422){
          $scope.showMessage(data.error.message);
        }else{
          $scope.showMessage("Something went wrong. Please try again.");
        }
      });
    }
  }

  $scope.showGuideScreens = function(){
    $scope.guideScreenImage = [1,2,3,4,5,6,7,8,9];
    $ionicModal.fromTemplateUrl('views/guideScreenModal.html', function (modal) {
      $scope.guideScreenModal = modal;
      $scope.guideScreenModal.show();
    }, {
      scope: $scope,
      animation: 'slide-in-right'
    });
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
    $scope.showLoader();
    window.plugins.socialsharing.shareViaWhatsApp(
      "Askmonk.in ( Innovative way to know about astrological solutions to one's crisp questions in no time. Download askmonk now where predictions are just a question away )",
      null,
      null,
      function() {
        $scope.hideLoader();
        console.log('share ok');
      },
      function(errormsg){
        $scope.hideLoader();
        $scope.showMessage("Whatsapp is not installed.");
        console.log(errormsg,"error")
      }
    );
  }

  $scope.changePassword = function(){
    $ionicModal.fromTemplateUrl('views/changePasswordModal.html', function (modal) {
      $scope.changePasswordModal = modal;
      $scope.changePasswordModal.show();
    }, {
      scope: $scope,
      animation: 'slide-in-right'
    });
  }

  $scope.resendValidation = function(){
    $ionicModal.fromTemplateUrl('resendValidationModal.html', function (modal) {
      $scope.resendValidationModal = modal;
      $scope.resendValidationModal.show();
    }, {
      scope: $scope,
      animation: 'slide-in-right'
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
            if(data && data.error.statusCode == 422){
              $scope.showMessage(data.error.message);
            }else{
              $scope.showMessage("Something went wrong. Please try again.");
            }
            // console.log(data,'error');
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
      $state.go('login');
      $scope.setAuth(false);
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      var currentPageTemplate = $state.current.templateUrl;
      $templateCache.remove(currentPageTemplate);
      $rootScope.profileData = null;
      localStorage.clear();
      $scope.loginType = localStorage.getItem('loginType');
      delete $http.defaults.headers.common.Authorization;
      $scope.hideLoader();
    },function(data){
      $scope.hideLoader();
      if(data && data.error.statusCode == 422){
        $scope.showMessage(data.error.message);
      }else{
        $scope.showMessage("Something went wrong. Please try again.");
      }
      // console.log(data,'error');
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
    if($scope.resendValidationModal && $scope.resendValidationModal.isShown()){
      $scope.resendValidationModal.remove();
    }
    if($scope.paymentInfoModal && $scope.paymentInfoModal.isShown()){
      $scope.paymentInfoModal.remove();
    }
    if($scope.guideScreenModal && $scope.guideScreenModal.isShown()){
      $scope.guideScreenModal.remove();
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
          if(data && data.error.statusCode == 422){
            $scope.showMessage(data.error.message);
          }else{
            $scope.showMessage("Something went wrong. Please try again.");
          }
          // console.log(data,"errors");
        });
      }else{
        utility.changeMonkPassword($scope.model)
        .then(function(data) {
          $scope.hideLoader();
          // console.log(data,"success");
          $scope.closeModal();
          $scope.showMessage("Password change successfully");
        }, function(data) {
          $scope.hideLoader();
          if(data && data.error.statusCode == 422){
            $scope.showMessage(data.error.message);
          }else{
            $scope.showMessage("Something went wrong. Please try again.");
          }
          // console.log(data,"errors");
        });
      }
    }
  }
}]);

askmonkApp.controller('resendValidationModalCtrl', ['$scope','utility','base64Encoding', function($scope,utility,base64Encoding){
  $scope.args = {"email":localStorage.email};
  $scope.resendValidationSendPopup = function(formData){
    if(formData.email.$viewValue == "" || formData.$invalid){
      $scope.showMessage("Please enter the correct email address");
      return;
    }
    $scope.showLoader();
    utility.resendValidationUser(base64Encoding.encode($scope.args.email))
    .then(function(data){
      $scope.hideLoader();
      $scope.closeModal();
      $scope.showMessage('Mail sent');
    },function(data){
      $scope.hideLoader();
      if(data && data.error.statusCode == 422){
        $scope.showMessage(data.error.message);
      }else{
        $scope.showMessage("Something went wrong. Please try again.");
      }
      // console.log(data);
    });
  }
}]);