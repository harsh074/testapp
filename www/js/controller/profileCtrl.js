askmonkApp.controller('profileCtrl', ['$scope','$state','utility','CONSTANT','$rootScope', function($scope, $state, utility,CONSTANT,$rootScope){
  
  $scope.floatingBtnAction = false;
	$scope.$on('$ionicView.enter', function(){
    $scope.floatingBtnAction = true;
    $scope.showLoader();
  });
  $scope.loginType = CONSTANT.loginType;

  if($scope.loginType == "user"){
    utility.getUserProfile()
    .then(function(data){
      localStorage.setItem("email",data.email);
      localStorage.setItem("name",data.name);
      $scope.$emit("updateSideMenuName",data);
    	$rootScope.profileData = data;
    	if(!data.dob || !data.birthPlace || !data.birthTime){
    		CONSTANT.isComingFromSignUp = true;
    		$state.go('app.editProfile');
        $scope.transitionAnimation('left');
    	}else{
    		$scope.hideLoader();
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
      $scope.$emit("updateSideMenuName",data);
      $rootScope.profileData = data;
      if(!data.name || !data.phone || !data.education || !data.residence || !data.experience){
        CONSTANT.isComingFromSignUp = true;
        $state.go('app.editProfile');
        $scope.transitionAnimation('left');
      }else{
        $scope.hideLoader();
        localStorage.setItem("email",data.email);
        localStorage.setItem("name",data.name);
        $scope.profileInfo = angular.copy($rootScope.profileData);
        $scope.profileImage = 'http://askmonk.in/mImages/'+$scope.profileInfo.email.split('@')[0].toLowerCase()+'.jpg';
      }
    },function(data){
      $scope.hideLoader();
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

  $scope.calculateAge = function calculateAge(birthday) { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
	}
}]);

askmonkApp.filter('ageFilter', function() {
  function calculateAge(birthday) { // birthday is a date
  	// console.log(birthday.getTime());
  	if(birthday){
  		birthday = new Date(birthday);
    	var ageDifMs = Date.now() - birthday.getTime();
    	var ageDate = new Date(ageDifMs); // miliseconds from epoch
    	return Math.abs(ageDate.getUTCFullYear() - 1970);
  	}
  }

  return function(birthdate) { 
    return calculateAge(birthdate);
  };
});