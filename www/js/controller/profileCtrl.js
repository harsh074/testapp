askmonkApp.controller('profileCtrl', ['$scope','$state','utility','CONSTANT','$rootScope','$timeout', function($scope, $state, utility,CONSTANT,$rootScope,$timeout){
  
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
          $scope.profileInfo = angular.copy($rootScope.profileData);
          $scope.profileImage = 'http://askmonk.in/mImages/'+$scope.profileInfo.email.split('@')[0].toLowerCase()+'.jpg';
        }
      },function(data){
        $scope.hideLoader();
        console.log(data);
      });
    }
  }

  if($scope.loginType == 'user'){
    utility.getUserCount()
    .then(function(data){
      $scope.getUserCount = data;
    },function(data){
      console.log(data);
    });
    if(!localStorage.timelineJson){
      utility.getTimeLineJson()
      .then(function(data){
        localStorage.setItem('timelineJson',JSON.stringify(data));
      },function(data){
        console.log(data);
      });
    }
  }else{
    utility.getMonkCount()
    .then(function(data){
      $scope.getMonkCount = data;
    },function(data){
      console.log(data);
    });
  }
  
  $scope.profileEdit = function(){
    $state.go('app.editProfile');
    $scope.transitionAnimation('left',300);
  }

  $scope.askQuestion = function(){
  	$state.go('app.askQuestion');
    $scope.transitionAnimation('left',180)
  }
}]);