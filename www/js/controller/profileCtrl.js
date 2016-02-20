askmonkApp.controller('profileCtrl', ['$scope','$state','utility','CONSTANT','$rootScope','$timeout','$ionicPopup', function($scope, $state, utility,CONSTANT,$rootScope,$timeout,$ionicPopup){
  
  $scope.floatingBtnAction = false;
	$scope.$on('$ionicView.enter', function(){
    $scope.floatingBtnAction = true;
    $scope.showLoader();
    if(CONSTANT.isDevice){
      cordova.plugins.Keyboard.close();
    }
  });

  $scope.loginType = CONSTANT.loginType;

  if(localStorage.getItem("profile")){
    $rootScope.profileData = JSON.parse(localStorage.getItem("profile"));
    $scope.profileInfo = angular.copy($rootScope.profileData);
    if($scope.loginType == "user"){
      $scope.profileImage = 'img/moonSign/'+$scope.profileInfo.moonSign+'.png';
    }else{
      $scope.profileImage = 'http://askmonk.in/mImages/'+$scope.profileInfo.email.split('@')[0].toLowerCase()+'.jpg';
    }

    $timeout(function(){
      $scope.hideLoader();
    }, 200);
  }else{
    if($scope.loginType == "user"){
      utility.getUserProfile(localStorage.getItem('userId'))
      .then(function(data){
        localStorage.setItem("email",data.email);
        localStorage.setItem("name",data.name);
        $scope.$emit("updateSideMenuName",data);
      	$rootScope.profileData = data;
      	if(!data.dob || !data.birthPlace || !data.birthTime || !data.gender){
      		CONSTANT.isComingFromSignUp = true;
      		$state.go('app.editProfile');
          $scope.transitionAnimation('left');
      	}else{
      		$scope.hideLoader();
          localStorage.setItem("profile",JSON.stringify(data));
      		$scope.profileInfo = angular.copy($rootScope.profileData);
          $scope.profileImage = 'img/moonSign/'+$scope.profileInfo.moonSign+'.png';
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
    }else{
      utility.getMonkProfile()
      .then(function(data){
        localStorage.setItem("email",data.email);
        localStorage.setItem("name",data.name);
        $scope.$emit("updateSideMenuName",data);
        $rootScope.profileData = data;
        if(!data.name || !data.phone || !data.education || !data.residence || !data.experience){
          CONSTANT.isComingFromSignUp = true;
          $state.go('app.editProfile');
          $scope.transitionAnimation('left');
        }else{
          $scope.hideLoader();
          localStorage.setItem("profile",JSON.stringify(data));
          $scope.$emit("updateAvaliableStatus");
          $scope.profileInfo = angular.copy($rootScope.profileData);
          $scope.profileImage = 'http://askmonk.in/mImages/'+$scope.profileInfo.email.split('@')[0].toLowerCase()+'.jpg';
          utility.directQuestionsPending()
          .then(function(data1){
            if(data1.length>0){
              $scope.directQuestionData = data1;
              $scope.showDirectQuestionCountPopup();
            }
            console.log(data1)
          },function(data1){
            if(data1 && data1.error.statusCode == 422){
              $scope.showMessage(data.error.message);
            }else{
              $scope.showMessage("Something went wrong. Please try again.");
            }
            // console.log(data1)
          });
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
  }

  if($scope.loginType == 'user'){
    utility.getUserCount()
    .then(function(data){
      $scope.getUserCount = data;
    },function(data){
      if(data && data.error.statusCode == 422){
        $scope.showMessage(data.error.message);
      }else{
        $scope.showMessage("Something went wrong. Please try again.");
      }
      console.log(data);
    });
    if(!localStorage.timelineJson){
      utility.getTimeLineJson()
      .then(function(data){
        localStorage.setItem('timelineJson',JSON.stringify(data));
      },function(data){
        if(data && data.error.statusCode == 422){
          $scope.showMessage(data.error.message);
        }else{
          $scope.showMessage("Something went wrong. Please try again.");
        }
        // console.log(data);
      });
    }
  }else{
    utility.getMonkCount()
    .then(function(data){
      $scope.getMonkCount = data;
    },function(data){
      if(data && data.error.statusCode == 422){
        $scope.showMessage(data.error.message);
      }else{
        $scope.showMessage("Something went wrong. Please try again.");
      }
      console.log(data);
    });
  }
  
  $scope.showDirectQuestionCountPopup = function(){
    var confirmPopup = $ionicPopup.show({
      cssClass:"ios",
      title: $scope.directQuestionData.length+' direct questions unanswered.',
      template:'Want to answer now?',
      scope:$scope,
      buttons: [
        {text: 'Ok',type:'button-ios button-clear',
          onTap: function(e) {
            return true;
          }
        },
        {text:'Cancel',type:'button-ios button-clear',
          onTap: function(e) {
            return false;
          }
        }
      ]
    });
    confirmPopup.then(function(res) {
      if(res) {
        console.log('You are sure');
        $state.go('app.directQuestion');
      } else {
        console.log('You are not sure');
      }
    });
  }

  $scope.profileEdit = function(){
    $state.go('app.editProfile');
    $scope.transitionAnimation('left',1200);
  }

  $scope.askQuestion = function(){
  	$state.go('app.askQuestion');
    $scope.transitionAnimation('left',900)
  }

}]);

askmonkApp.filter('getEducation',function(){
  return function(input){
    console.log(input);
    if(input == "10" || input == "12"){
      return input+"th";
    }else{
      return input;
    }
  }
});