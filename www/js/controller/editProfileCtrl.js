askmonkApp.controller('editProfileCtrl', ['$scope','$state','CONSTANT','$rootScope','utility', function($scope,$state,CONSTANT,$rootScope,utility){
  if($scope.authenticated){

    $scope.showDate = false;
    
    if(CONSTANT.isComingFromSignUp){
      $scope.$emit("updateEditProfileFirstUser");
    }
    // console.log($rootScope.profileData);


    if($rootScope.profileData){
      $scope.editProfileData = angular.copy($rootScope.profileData);
      $scope.editProfileData.birthTime = new Date($scope.editProfileData.birthTime);
      $scope.showDate = true;
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
      from: new Date(1970, 1, 1), //Optional
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

    $scope.saveEditProfile = function(){
      utility.updateUserProfile($scope.editProfileData)
      .then(function(data){
        CONSTANT.isComingFromSignUp = false;
        localStorage.removeItem("profileData");
        $scope.$emit("updateEditProfileFirstUser");
        $state.go('app.profile');
      },function(data){
        console.log(data);

      })
    }
    
    $scope.cancelEditProfile = function(){
      $state.go('app.profile');
    }

  }
}]);