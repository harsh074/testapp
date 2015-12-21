askmonkApp.controller('editProfileCtrl', ['$scope','$state','CONSTANT','$rootScope','utility','$timeout', function($scope,$state,CONSTANT,$rootScope,utility,$timeout){
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

    var zod_signs = ["capricorn" , "aquarius", "pisces", "aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius"];

    function getMoonSign(data){
      var dob = new Date(data.dob);
      var dobDate = dob.getDate();
      var dobMonth = dob.getMonth();

      switch(dobMonth){
        case 0: {//January
          if(dobDate < 20)
            data.moonSign = zod_signs[0];
          else
            data.moonSign = zod_signs[1];
          }break;
        case 1: {//February
          if(dobDate < 19)
            data.moonSign = zod_signs[1];
          else
            data.moonSign = zod_signs[2];
          }break;
        case 2: {//March
          if(dobDate < 21)
            data.moonSign = zod_signs[2];
          else
            data.moonSign = zod_signs[3];
          }break;
        case 3: {//April
          if(dobDate < 20)
            data.moonSign = zod_signs[3];
          else
            data.moonSign = zod_signs[4];
          }break;
        case 4: {//May
          if(dobDate < 21)
            data.moonSign = zod_signs[4];
          else
            data.moonSign = zod_signs[5];
          }break;
        case 5: {//June
          if(dobDate < 21)
            data.moonSign = zod_signs[5];
          else
            data.moonSign = zod_signs[6];
          }break;
        case 6: {//July
          if(dobDate < 23)
            data.moonSign = zod_signs[6];
          else
            data.moonSign = zod_signs[7];
          }break;
        case 7: {//August
          if(dobDate < 23)
            data.moonSign = zod_signs[7];
          else
            data.moonSign = zod_signs[8];
          }break;
        case 8: {//September
          if(dobDate < 23)
            data.moonSign = zod_signs[8];
          else
            data.moonSign = zod_signs[9];
          }break;
        case 9: {//October
          if(dobDate < 23)
            data.moonSign = zod_signs[9];
          else
            data.moonSign = zod_signs[10];
          }break;
        case 10: {//November
          if(dobDate < 22)
            data.moonSign = zod_signs[10];
          else
            data.moonSign = zod_signs[11];
          }break;
        case 11: {//December
          if(dobDate < 22)
            data.moonSign = zod_signs[11];
          else
            data.moonSign = zod_signs[0];
          }break;
      }
      return data;
    }
  }
}]);