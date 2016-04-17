askmonkApp.controller('settingCtrl', ['$scope','utility','$ionicHistory','$rootScope','$http','$state','$templateCache','$ionicModal','$ionicPopup','CONSTANT', function($scope,utility,$ionicHistory,$rootScope,$http,$state,$templateCache,$ionicModal,$ionicPopup,CONSTANT){

  $scope.loginType = CONSTANT.loginType;
  $scope.noPaymentFound = false;
  $scope.userModal = JSON.parse(localStorage.profile);
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
    window.open('http://askmonk.in/privacy.html', '_system', 'location=yes'); 
    return false;
  }

  $scope.termsCondition = function(){
    window.open('http://askmonk.in/tandc.html', '_system', 'location=yes'); 
    return false;
  }

  $scope.openBlog = function(){
    window.open('https://askmonkblog.wordpress.com', '_system', 'location=yes'); 
    return false;
  }

  $scope.rateUsApp = function(){
    var openUrl = window.open('market://details?id=com.askmonk.in');
    openUrl.addEventListener('loadstop', function(event) { 
      openUrl.close();
    });
  }

  $scope.payGoogleWallet = function(){
    /*if((window.device && device.platform == "Android") && typeof inappbilling !== "undefined") {
      inappbilling.buy(function(data) {
        console.log("ITEM PURCHASED");
        alert("ITEM PURCHASED" + JSON.stringify(data));
      }, function(errorBuy) {
        console.log("ERROR BUYING -> " + errorBuy);
        alert("ERROR BUYING -> " + JSON.stringify(errorBuy));
      }, 
      "question250");
    }*/


    // https://www.payumoney.com/paybypayumoney/#/121195
    // https://www.payumoney.com/pay/#/merchant/99870B53C5BE8B304170B42D5FB27B16?param=5453900
    // https://www.payumoney.com/pay/#/?param=5453900
    var ref = window.open('https://www.payumoney.com/paybypayumoney/#/121195', '_blank', 'location=no');
    ref.addEventListener('loadstart', function(event) { 
      if(event.url.indexOf('payumoney') > -1){
        // alert('start: ' + event.url);
        if(event.url.indexOf('payment/notification/success') > -1){
          var paymentId = event.url.split('/')[event.url.split('/').length-1];
          
        } 
      }
    });
    ref.addEventListener('loadstop', function(event) {
      ref.close();
      if(event.url.indexOf('payumoney') > -1){
        alert('stop: ' + event.url); 
      }
    });
     ref.addEventListener('loaderror', function(event) { alert('error: ' + event.message); });
     ref.addEventListener('exit', function(event) { alert(event.type); });
    /*var options = {
      src: "https://www.payumoney.com/paybypayumoney/#/121195",
      height: "100%",
      width: "100%", 
      x: 0,
      y: 0,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      scalesPageToFit: true,
      bounces: true,
      animation: {
        type: "fadeIn",
        duration: "300"
      }
    };
    wizViewManager.create("Askmonk",options, function(data){
        alert(data);
        $scope.showBackground = true;
        wizViewManager.show(data.name,options,function(data1){alert(data1)},function(data){alert(data1)});
      }, function(data){
        alert(data);
      }
    );*/


     // var url = "https://test.payumoney.com/payment/payment/createPayment";
     // var url = "https://www.payumoney.com/auth/op/searchMerchant"
     //var url = "https://secure.payu.com/api/v2_1/orders"; /**/
     // var url = "https://secure.payu.com/en/standard/user/oauth/authorize";
     //var method = "POST"; /**/
     // var method = "GET";

     /*var params = {"grant_type":"client_credentials","client_id":"5453900","client_secret":"3W1P41uzXP"}*/
     /*var params = {"count":1,"isPageable":true,"offset":0,"param":5453900}*/
     
     /*var data = {
      "notifyUrl": "http://askmonk.in/privacy.html",
      "customerIp": "127.0.0.1",
      "merchantPosId": "5453900",
      "description": "Askmonk Payment",
      "currencyCode": "INR",
      "totalAmount": "2",
      "products": [
        {
          "name": "Question",
          "unitPrice": "1",
          "quantity": "1"
        }
      ]
    };*/
    // var data = {};
    /*var params = {};
    $http.defaults.headers.common.Authorization = 'Basic NTQ1MzkwMDowY2Q0YTViNzU5ZmU5ZDFiZDM0OGJlNjhlNDdhZjQwZQ==';
    $http({
      url: url,
      method: method,
      data: data,
      params:params
    })
    .success(function(data, status, headers, config) {
      console.log(data)
    })
    .error(function(data, status, headers, config) {
      console.log(data);
    });*/   
  }

  $scope.getPaymentInfo = function(){
    $scope.showLoader();
    if($scope.loginType == "user"){
      utility.userPaymentInfo()
      .then(function(data){
        $scope.hideLoader();
        $scope.paymentReceipts = data;
        if($scope.paymentReceipts.length == 0){
          $scope.noPaymentFound = true;
        }
        $ionicModal.fromTemplateUrl('paymentInfoModal.html', function (modal) {
          $scope.paymentInfoModal = modal;
          $scope.paymentInfoModal.show();
        },{
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
        $scope.paymentReceipts = data;
        if($scope.paymentReceipts.length == 0){
          $scope.noPaymentFound = true;
        }
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
    $scope.guideScreenImage = [1,2,3,4,5,6,7,8,9,10];
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
      "http://www.askmonk.in ( Innovative way to know about astrological solutions to one's crisp questions in no time. Download Askmonk now where predictions are just a question away )",
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
      title: 'Do you want to logout of Askmonk?',
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
      // For Social Logout
      var loginSocialStatus = JSON.parse(localStorage.profile).isSocial;
      if(loginSocialStatus){
        if(loginSocialStatus == "Google"){
          window.plugins.googleplus.logout(function (msg) {
            console.log(msg);
          });
        }else if(loginSocialStatus == "Facebook"){
          facebookConnectPlugin.logout(function(){
            console.log("Facebook Logout");
          },
          function(fail){
            console.log(fail);
          });
        }
      }
      $state.go('login');
      $scope.setAuth(false);
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      var currentPageTemplate = $state.current.templateUrl;
      $templateCache.remove(currentPageTemplate);
      $rootScope.profileData = null;
      localStorage.clear();
      sessionStorage.clear();
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