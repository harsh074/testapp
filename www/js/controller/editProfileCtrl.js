askmonkApp.controller('editProfileCtrl', ['$scope','$state','CONSTANT','$rootScope','utility','$timeout','getMoonSign', function($scope,$state,CONSTANT,$rootScope,utility,$timeout,getMoonSign){
  if($scope.authenticated){

    $scope.$on('$ionicView.enter', function(){
      $scope.showLoader();
    });
    $scope.loginType = CONSTANT.loginType;

    $timeout(function(){
      $scope.hideLoader();  
    }, 400);

    $scope.showDate = false;

    if(CONSTANT.isComingFromSignUp){
      $scope.$emit("updateEditProfileFirstUser");
    }

    if($rootScope.profileData){
      $scope.editProfileData = angular.copy($rootScope.profileData);
      if($scope.loginType == "user"){
        $scope.editProfileData.birthTime = new Date($scope.editProfileData.birthTime);
        $scope.showDate = true;
      }
    }else if(localStorage.getItem("profileData")){
      $scope.editProfileData = JSON.parse(localStorage.getItem("profileData"));
    }else{
      $scope.editProfileData = {};
    }

    $scope.datepickerObject = {
      titleLabel: 'DOB',  //Optional
      todayLabel: 'Today',  //Optional
      closeLabel: 'Close',  //Optional
      setLabel: 'Set',  //Optional
      setButtonType : 'button-askmonk',  //Optional
      todayButtonType : 'button-askmonk',  //Optional
      closeButtonType : 'button-askmonk',  //Optional
      inputDate: $scope.editProfileData.dob ? new Date($scope.editProfileData.dob):new Date(),  //Optional
      mondayFirst: true,  //Optional
      // disabledDates: disabledDates, //Optional
      // weekDaysList: weekDaysList, //Optional
      // monthList: monthList, //Optional
      templateType: 'popup', //Optional
      showTodayButton: 'false', //Optional
      modalHeaderColor: 'bar-positive', //Optional
      modalFooterColor: 'bar-positive', //Optional
      from: new Date(1940, 1, 1), //Optional
      to: new Date(),  //Optional
      callback: function (val) {  //Mandatory
        datePickerCallback(val);
      },
      dateFormat: 'dd-MM-yyyy', //Optional
      closeOnSelect: false //Optional
    };
    
    function datePickerCallback(val){
      // console.log(val);
      $scope.showDate = true;
      if(val){
        $scope.datepickerObject.inputDate = val;
      }else{
        $scope.datepickerObject.inputDate = new Date();
      }
      $scope.editProfileData.dob = angular.copy($scope.datepickerObject.inputDate);
    }

    $scope.expandText = function(){
      var element = document.getElementById("bioTextarea");
      element.style.height =  element.scrollHeight + "px";
    }

    $scope.saveEditProfile = function(){
      $scope.showLoader();
      if($scope.loginType == 'user'){
        if(!$scope.editProfileData.dob || !$scope.editProfileData.birthPlace || !$scope.editProfileData.birthTime){
          $scope.showMessage("All fields are required");
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
            $scope.transitionAnimation('left',180);
          },function(data){
            $scope.hideLoader();
            console.log(data);
          });
        }
      }else{
        if(!$scope.editProfileData.name || !$scope.editProfileData.phone || !$scope.editProfileData.education || !$scope.editProfileData.residence || !$scope.editProfileData.experience){
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
            console.log(data);
          });
        }
      }

    }
    
    $scope.cancelEditProfile = function(){
      $state.go('app.profile');
      $scope.transitionAnimation('left',180);
    }
  }
}]);