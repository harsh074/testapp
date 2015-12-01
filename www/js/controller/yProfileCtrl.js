askmonkApp.controller('yProfileCtrl', ['$scope','$state', function($scope,$state){
	  $scope.askQuestion = function(){
	  	$scope.showLoader();
	  	$state.go('app.askQuestion',{},{"reload":true})
	  }
}]);