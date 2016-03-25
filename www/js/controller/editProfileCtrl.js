askmonkApp.controller('editProfileCtrl', ['$scope','$state','CONSTANT','$rootScope','utility','$timeout','getMoonSign', function($scope,$state,CONSTANT,$rootScope,utility,$timeout,getMoonSign){
  if($scope.authenticated){
    $scope.loginType = CONSTANT.loginType;

    if($scope.loginType == 'user'){
      $scope.showLoader();
      utility.getUserCount()
      .then(function(data){
        $scope.getUserCount = data;
        $scope.hideLoader();
      },function(data){
        if(data && data.error.statusCode == 422){
          $scope.showMessage(data.error.message);
        }else{
          $scope.showMessage("Something went wrong. Please try again.");
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

    if($scope.editProfileData.dob){
      $scope.showDate = true;
      $scope.selectedDate = angular.copy($scope.editProfileData.dob);
    }else{
      $scope.showDate = false;
      $scope.selectedDate = "";
    }

    $scope.datepickerObject = {
      titleLabel: 'Date Of Birth',
      lowDateTitleLabel:'DOB',
      todayLabel: 'Today',
      closeLabel: 'Close',
      setLabel: 'Set',
      setButtonType : 'button-askmonk',
      todayButtonType : 'button-askmonk',
      closeButtonType : 'button-askmonk',
      inputDate:$scope.editProfileData.dob?new Date($scope.editProfileData.dob):new Date(),
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
        if(val&& (new Date().getFullYear()!=val.getFullYear() || new Date().getDate()!=val.getDate())){
          datePickerCallback(val);
        }
      },
      dateFormat: 'dd-MM-yyyy',
      closeOnSelect: true
    };
    
    function datePickerCallback(val){
      if(new Date(val) != 'Invalid Date'){
        $scope.showDate = true;
        $scope.datepickerObject.inputDate = val;
        $scope.selectedDate = val
      }else{
        // $scope.datepickerObject.inputDate = new Date();
      }
      $scope.editProfileData.dob = angular.copy($scope.datepickerObject.inputDate);
    }

    $scope.timePickerObject12Hour = {
      inputEpochTime:($scope.editProfileData.birthTime?(new Date($scope.editProfileData.birthTime).getHours()*60*60+60*(new Date($scope.editProfileData.birthTime)).getMinutes()):(new Date()).getHours()*60*60+60*(new Date()).getMinutes()),
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

    $scope.timePicker12Callback = function(){
      angular.element(document.getElementsByClassName('ion-birth-time')).addClass('used');
      /*if (typeof (val) === 'undefined'){
        // console.log('Time not selected');
        if(!$scope.editProfileData.birthTime){
          $scope.editProfileData.birthTime = new Date();
        }
      } else {
        var selectedTime = new Date(val * 1000);
        $scope.editProfileData.birthTime = new Date();
        $scope.editProfileData.birthTime.setMinutes(selectedTime.getUTCMinutes());
        $scope.editProfileData.birthTime.setHours(selectedTime.getUTCHours());
        // console.log($scope.editProfileData.birthTime);
      }*/
    }

    $scope.expandText = function(){
      var element = document.getElementById("bioTextarea");
      element.style.height =  element.scrollHeight + "px";
    }

    $scope.saveEditProfile = function(){
      $scope.showLoader();
      if($scope.loginType == 'user'){
        if(!$scope.editProfileData.dob || !$scope.editProfileData.birthPlace || !$scope.editProfileData.birthTime || !$scope.editProfileData.gender || !$scope.editProfileData.mobile || !$scope.editProfileData.name || !$scope.editProfileData.maritalStatus || !$scope.editProfileData.profession || !$scope.editProfileData.qualification || !$scope.editProfileData.numberOfChildren){
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
            if(localStorage.firstTime){
              localStorage.setItem('firstTimeUser',true);
            }
            $scope.$emit("updateEditProfileFirstUser");
            $state.go('app.profile');
            if(!$scope.getUserCount.emailVerified){
              $scope.showMessage("Email Sent. Please Verify!");
            }
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
      }else{
        if(!$scope.editProfileData.name || !$scope.editProfileData.phone || !$scope.editProfileData.education || !$scope.editProfileData.residence || !$scope.editProfileData.experience || !$scope.editProfileData.city || !$scope.editProfileData.state || !$scope.editProfileData.country){
          $scope.hideLoader();
          $scope.showMessage("All fields are required");
          return;
        }else{
          utility.updateMonkProfile($scope.editProfileData)
          .then(function(data){
            $scope.hideLoader();
            CONSTANT.isComingFromSignUp = false;
            localStorage.removeItem("profileData");
            localStorage.setItem("name",$scope.editProfileData.name);
            localStorage.setItem("profile",JSON.stringify(data));
            $scope.$emit("updateEditProfileFirstUser");
            $state.go('app.profile');
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
      }

    }
  }
}]);