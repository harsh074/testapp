askmonkApp.controller('profileCtrl', ['$scope','$state','utility','CONSTANT','$rootScope', function($scope, $state, utility,CONSTANT,$rootScope){
  
  $scope.floatingBtnAction = false;
	$scope.$on('$ionicView.enter', function(){
    $scope.floatingBtnAction = true;
  });

	$scope.showLoader();

  utility.getUserProfile()
  .then(function(data){
  	$rootScope.profileData = data;
  	if(!data.dob || !data.birthPlace || !data.birthTime){
  		CONSTANT.isComingFromSignUp = true;
  		$state.go('app.editProfile');
  	}else{
  		$scope.hideLoader();
  		$scope.profileInfo = angular.copy($rootScope.profileData);
      $scope.profileImage = 'img/moonSign/'+$scope.profileInfo.moonSign+'.png';
  	}
  },function(data){
  	$scope.hideLoader();
  	console.log(data);
  });
  
  $scope.profileEdit = function(){
  	$scope.showLoader();
    $state.go('app.editProfile');
  }

  $scope.askQuestion = function(){
    $scope.showLoader();
  	$state.go('app.askQuestion');
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