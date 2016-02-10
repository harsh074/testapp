askmonkApp.controller('editProfileCtrl', ['$scope','$state','CONSTANT','$rootScope','utility','$timeout','getMoonSign', function($scope,$state,CONSTANT,$rootScope,utility,$timeout,getMoonSign){
  if($scope.authenticated){

    $scope.$on('$ionicView.enter', function(){
      $scope.showLoader();
    });

    $scope.loginType = CONSTANT.loginType;

    $timeout(function(){
      $scope.hideLoader();  
    }, 400);

    if($scope.loginType == 'user'){
      utility.getUserCount()
      .then(function(data){
        $scope.getUserCount = data;
      },function(data){
        if(data.error.statusCode == 422){
          $scope.showMessage(data.error.message);
        }
        console.log(data);
      });
    }
    $scope.showDate = false;

    if(CONSTANT.isComingFromSignUp){
      $scope.$emit("updateEditProfileFirstUser");
    }

    if($rootScope.profileData){
      $scope.editProfileData = angular.copy($rootScope.profileData);
      if($scope.loginType == "user"){
        if($scope.editProfileData.birthTime){
          $scope.editProfileData.birthTime = new Date($scope.editProfileData.birthTime);
        }
        $scope.showDate = true;
      }
    }else if(localStorage.getItem("profileData")){
      $scope.editProfileData = JSON.parse(localStorage.getItem("profileData"));
    }else{
      $scope.editProfileData = {};
    }
    console.log($scope.editProfileData);
    $timeout(function(){
      if($scope.editProfileData.birthPlace){
        angular.element(document.getElementsByClassName('ion-google-place')).addClass('used');
      }
      if($scope.editProfileData.birthTime){
        angular.element(document.getElementsByClassName('ion-birth-time')).addClass('used');
      }
    }, 50);

    $scope.datepickerObject = {
      titleLabel: 'DOB',
      todayLabel: 'Today',
      closeLabel: 'Close',
      setLabel: 'Set',
      setButtonType : 'button-askmonk',
      todayButtonType : 'button-askmonk',
      closeButtonType : 'button-askmonk',
      inputDate: $scope.editProfileData.dob ? new Date($scope.editProfileData.dob):new Date(),
      mondayFirst: true,
      // disabledDates: disabledDates,
      // weekDaysList: weekDaysList,
      // monthList: monthList,
      templateType: 'popup',
      showTodayButton: 'false',
      modalHeaderColor: 'bar-positive',
      modalFooterColor: 'bar-positive',
      from: new Date(1940, 1, 1),
      to: new Date(),
      callback: function (val) {
        datePickerCallback(val);
      },
      dateFormat: 'dd-MM-yyyy',
      closeOnSelect: true
    };
    
    function datePickerCallback(val){
      $scope.showDate = true;
      if(val){
        $scope.datepickerObject.inputDate = val;
      }else{
        $scope.datepickerObject.inputDate = new Date();
      }
      $scope.editProfileData.dob = angular.copy($scope.datepickerObject.inputDate);
    }

    $scope.timePickerObject12Hour = {
      inputEpochTime:($scope.editProfileData.birthTime?(new Date($scope.editProfileData.birthTime)).getHours()*60*60+60*(new Date($scope.editProfileData.birthTime)).getMinutes():(new Date()).getHours()*60*60),
      step: 1,
      format: 12,
      titleLabel: 'Birth Time',
      closeLabel: 'Close',
      setLabel: 'Set',
      setButtonType: 'button-askmonk',
      closeButtonType: 'button-askmonk',
      callback: function (val) {
        timePicker12Callback(val);
      }
    }

    function timePicker12Callback(val){
      angular.element(document.getElementsByClassName('ion-birth-time')).addClass('used');
      if (typeof (val) === 'undefined'){
        // console.log('Time not selected');
        $scope.editProfileData.birthTime = new Date();
      } else {
        var selectedTime = new Date(val * 1000);
        $scope.editProfileData.birthTime = new Date();
        $scope.editProfileData.birthTime.setMinutes(selectedTime.getUTCMinutes());
        $scope.editProfileData.birthTime.setHours(selectedTime.getUTCHours());
        // console.log($scope.editProfileData.birthTime);
      }
    }

    $scope.expandText = function(){
      var element = document.getElementById("bioTextarea");
      element.style.height =  element.scrollHeight + "px";
    }

    $scope.saveEditProfile = function(){
      $scope.showLoader();
      if($scope.loginType == 'user'){
        if(!$scope.editProfileData.dob || !$scope.editProfileData.birthPlace || !$scope.editProfileData.birthTime || !$scope.editProfileData.gender){
          $scope.hideLoader();
          $scope.showMessage("All fields are required");
          return;
        }else if($scope.editProfileData.mobile.toString().length != 10){
          $scope.hideLoader();
          $scope.showMessage("Please enter the valid mobile number");
          return;
        }else{
          utility.updateUserProfile(getMoonSign($scope.editProfileData))
          .then(function(data){
            $scope.hideLoader();
            CONSTANT.isComingFromSignUp = false;
            localStorage.removeItem("profileData");
            localStorage.setItem("name",$scope.editProfileData.name);
            localStorage.setItem("profile",JSON.stringify(data));
            $scope.$emit("updateEditProfileFirstUser");
            $state.go('app.profile');
            if(!$scope.getUserCount.emailVerified){
              $scope.showMessage("Email Sent. Please Verify!");
            }
            $scope.transitionAnimation('left',180);
          },function(data){
            $scope.hideLoader();
            if(data.error.statusCode == 422){
              $scope.showMessage(data.error.message);
            }
            console.log(data);
          });
        }
      }else{
        if(!$scope.editProfileData.name || !$scope.editProfileData.phone || !$scope.editProfileData.education || !$scope.editProfileData.residence || !$scope.editProfileData.experience){
          $scope.hideLoader();
          $scope.showMessage("All fields are required");
          return;
        }else{
          utility.updateMonkProfile(getMoonSign($scope.editProfileData))
          .then(function(data){
            $scope.hideLoader();
            CONSTANT.isComingFromSignUp = false;
            localStorage.removeItem("profileData");
            localStorage.setItem("name",$scope.editProfileData.name);
            localStorage.setItem("profile",JSON.stringify(data));
            $scope.$emit("updateEditProfileFirstUser");
            $state.go('app.profile');
            $scope.transitionAnimation('left',180);
          },function(data){
            $scope.hideLoader();
            if(data.error.statusCode == 422){
              $scope.showMessage(data.error.message);
            }
            console.log(data);
          });
        }
      }

    }
  }
}]);