askmonkApp.controller('profileCtrl', ['$scope','$state','utility','CONSTANT','$rootScope', function($scope, $state, utility,CONSTANT,$rootScope){
  
  utility.getUserProfile()
  .then(function(data){
  	// console.log(data);
  	$rootScope.profileData = data;
  	if(!data.dob || !data.birthPlace || !data.birthTime){
  		CONSTANT.isComingFromSignUp = true;
  		$state.go('app.editProfile');
  	}else{
  		console.log("data");
  		$scope.profileInfo = angular.copy($rootScope.profileData);
  	}
  },function(data){
  	console.log(data);
  });
  
  $scope.profileEdit = function(){
    $state.go('app.editProfile');
  }

  $scope.askQuestion = function(){
  	$state.go('app.askQuestion',{},{"reload":true})
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